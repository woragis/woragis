provider "aws" {
  region = var.aws_region
}

module "route53_domain" {
  source             = "git::https://github.com/woragis/terraform-route53-domain.git//?ref=v1"
  aws_region         = var.aws_region
  root_domain        = var.root_domain
  environment        = var.environment
  project_name       = var.project_name
}
