provider "aws" {
  region = var.aws_region
}

module "route53" {
  source             = "git::https://github.com/woragis/terraform-route53.git//?ref=v1"
  project-name       = var.project_name
  terraform-dir      = "./"
  aws-region         = var.aws_region
  root-domain        = var.root_domain
  subdomain          = var.subdomain
  target-domain      = var.target_domain
  target-record-type = var.target_record_type
}
