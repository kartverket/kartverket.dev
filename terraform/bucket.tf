resource "random_string" "bucket_name" {
  length  = 10
  special = false
  upper   = false
}

resource "google_storage_bucket" "techdocs" {
  name                        = "techdocs${random_string.bucket_name.result}"
  location                    = var.location
  force_destroy               = true
  project                     = var.gcp_project_id
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_iam_binding" "service_accounts" {
  bucket = google_storage_bucket.techdocs.name
  role   = "roles/storage.objectAdmin"
  members = [
    "serviceAccount:${google_service_account.writer.email}",
    "serviceAccount:${google_service_account.backstage.email}",
  ]
}
