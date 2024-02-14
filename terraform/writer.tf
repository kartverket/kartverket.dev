#Creates the service account to uploads techdocs to the bucket

resource "google_service_account" "writer" {
  account_id   = "techdocs-writer"
  display_name = "TechDocs Writer"
  project      = var.gcp_project_id
}

resource "google_storage_bucket_iam_binding" "writer" {
  bucket = google_storage_bucket.techdocs.name
  role   = "roles/storage.admin"
  members = [
    "serviceAccount:${google_service_account.writer.email}",
  ]
}

resource "google_iam_workload_identity_pool" "backstage" {
  workload_identity_pool_id = "backstage-techdocs-pool"
  description               = "pool to handle backstage service accounts"
}

resource "google_iam_workload_identity_pool_provider" "backstage" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.backstage.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  description                        = "Workload Identity Pool Provider managed by Terraform"
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.aud"        = "assertion.aud"
    "attribute.enterprise" = "assertion.enterprise"
  }
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account_iam_member" "wif_backstage_writer" {
  service_account_id = google_service_account.writer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.backstage.name}/attribute.enterprise/kartverket"
}
