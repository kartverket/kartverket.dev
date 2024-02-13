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
