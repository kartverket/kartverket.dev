variable "gcp_project_id" {
  type        = string
  description = "The GCP project to deploy into"
}

variable "kubernetes_gcp_project_id" {
  type        = string
  description = "The GCP project where the Kubernetes cluster is managed"
}

variable "location" {
  type    = string
  default = "EUROPE-NORTH1"
}

variable "kubernetes_namespace" {
  type    = string
  default = "backstage"
}

variable "kubernetes_service_account_name" {
  type    = string
  default = "backstage"
}

