terraform {
  backend "gcs" {
    bucket = "terraform_state_utviklerportal_e053"
    prefix = "utviklerportal"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.4.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.location
}
