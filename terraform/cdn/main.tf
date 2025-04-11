provider "aws" {
  region = var.aws_region
}

module "cdn" {
  source                       = "git::https://github.com/woragis/terraform-cdn.git//?ref=v1"
  aws_region                   = var.aws_region
  project_name                 = var.project_name
  root_domain                  = var.root_domain
  subdomain                    = var.subdomain
  origin_domain_name           = var.origin_domain_name
  tags                         = var.tags
  environment                  = var.environment
  ssl_minimum_protocol_version = var.ssl_minimum_protocol_version
}
