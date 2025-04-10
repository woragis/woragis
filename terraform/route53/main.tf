provider "aws" {
  region = var.aws_region
}

module "route53" {
  source             = "git::https://github.com/woragis/terraform_route53.git//?ref=v1"
  project_name       = var.project_name
  terraform_dir      = "./"
  aws_region         = var.aws_region
  root_domain        = var.root_domain
  subdomain          = var.subdomain
  target_domain      = var.target_domain
  target_record_type = var.target_record_type
}
