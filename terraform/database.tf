module "cloudsql_test" {
  source        = "git@github.com:kartverket/terraform-modules.git/?ref=cloud_sql/0.1.1"
  instance_name = "backstage"
}
