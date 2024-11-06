module "cloudsql" {
  source          = "git@github.com:kartverket/terraform-modules.git/?ref=cloud_sql/v0.6.0"
  instance_name   = "backstage"
  env             = var.env
  project_id      = var.gcp_project_id
  instance_tier   = "db-g1-small"
  max_connections = 100
}

module "postgres_config" {
  source            = "git@github.com:kartverket/terraform-modules.git/?ref=cloud_sql_config/v0.3.1"
  gcp_instance_name = module.cloudsql.cloud_sql_instance_name
  gcp_project_id    = var.gcp_project_id
  env               = var.env
  databases = {
    "backstage" = {
      name  = "backstage"
      owner = "backstage"
    },
    "opencost-cacher" = {
      name  = "opencost_cacher"
      owner = "opencost-cacher"
    },
  }
}
