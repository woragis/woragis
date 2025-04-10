provider "aws" {
  region = var.aws_region
}

module "cdn" {
  source                       = "git::https://github.com/woragis/terraform-cdn.git//?ref=v1"
  origin_domain_name           = var.origin_domain_name
  tags                         = var.tags
  full_domain                  = "${var.subdomain}.${var.root_domain}"
  environment                  = var.environment
  ssl_minimum_protocol_version = var.ssl_minimum_protocol_version
}
