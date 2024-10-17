module "cloudsql" {
  source        = "git@github.com:kartverket/terraform-modules.git/?ref=cloud_sql/v0.2.3"
  instance_name = "backstage"
  env           = var.env
  project_id    = var.gcp_project_id
}
