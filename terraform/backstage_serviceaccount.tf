# Creates the service account used by the backstage pod to read the techdocs bucket

resource "google_service_account" "backstage" {
  account_id   = "backstage"
  display_name = "Backstage service account"
  project      = var.gcp_project_id
}

resource "google_service_account_iam_binding" "kubernetes" {
  role               = "roles/iam.workloadIdentityUser"
  service_account_id = google_service_account.backstage.name
  members = [
    "serviceAccount:${var.kubernetes_gcp_project_id}.svc.id.goog[${var.kubernetes_namespace}/${var.kubernetes_service_account_name}]"
  ]
}

resource "google_service_account_iam_binding" "kubernetes_token" {
  role               = "roles/iam.serviceAccountTokenCreator"
  service_account_id = google_service_account.backstage.name
  members = [
    "serviceAccount:${var.kubernetes_gcp_project_id}.svc.id.goog[${var.kubernetes_namespace}/${var.kubernetes_service_account_name}]",
    "user:august.dahl@kartverket.no",
    "user:jonas.wagle@kartverket.no",
  ]
}
