terraform {
  backend "gcs" {}
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.location
}