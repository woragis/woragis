provider "aws" {
  region = var.aws_region
}

module "cdn" {
  source                       = "git::https://github.com/woragis/terraform-cdn.git//?ref=v1"
  project_name                 = var.project_name
  terraform_dir                = "./"
  aws_region                   = var.aws_region
  root_domain                  = var.root_domain
  subdomain                    = var.subdomain
  environment                  = var.environment
  origin_domain_name           = var.origin_domain_name
  logging_bucket_domain_name   = var.logging_bucket_domain_name
  cloudfront_distribution_name = var.cloudfront_distribution_name
  ssl_minimum_protocol_version = var.ssl_minimum_protocol_version
  tags                         = var.tags
}
