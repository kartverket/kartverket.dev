## Upgrading

1. JIT first, if needed
2. Login to gcp with `gcloud auth application-default login --project $PROJECT`
3. Run `terraform init -backend-config=backend-sandbox.hcl -var-file=sandbox.tfvars -upgrade`
