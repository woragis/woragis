provider "aws" {
  region = var.aws_region
}

module "route53" {
  source             = "git::https://github.com/woragis/terraform-route53.git//?ref=v1"
  aws_region         = var.aws_region
  root_domain        = var.root_domain
  subdomain          = var.subdomain
  target_record_type = var.target_record_type
  target_domain      = var.target_domain
  ttl                = var.ttl
  environment        = var.environment
  project_name       = var.project_name
}
