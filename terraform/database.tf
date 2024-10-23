module "cloudsql" {
  source        = "git@github.com:kartverket/terraform-modules.git/?ref=cloud_sql/v0.5.0"
  instance_name = "backstage"
  env           = var.env
  project_id    = var.gcp_project_id
  instance_tier = "db-g1-small"
}
