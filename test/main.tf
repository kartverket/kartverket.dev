module "cloudsql_test" {
  source        = "git@github.com:kartverket/terraform-modules.git/?ref=cloud_sql/0.1.0"
  env           = "sandbox"
  instance_name = "test2"
  project_id    = "skip-sandbox-37c2"
  iam_users = {
    some-user = {
      app_namespace = "foo-main"
      app_name      = "some-api-backend"
    },
  }
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.3.0"
    }
  }
}

provider "google" {
  region = "europe-north1"
}
