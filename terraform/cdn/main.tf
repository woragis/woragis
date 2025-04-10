provider "aws" {
  region = var.aws_region
}

module "cdn" {
  source                       = "git::https://github.com/woragis/terraform-cdn.git//?ref=v1"
  project-name                 = var.project_name
  terraform-dir                = "./"
  aws-region                   = var.aws_region
  root-domain                  = var.root_domain
  subdomain                    = var.subdomain
  environment                  = var.environment
  origin-domain-name           = var.origin_domain_name
  logging-bucket-domain-name   = var.logging_bucket_domain_name
  cloudfront-distribution-name = var.cloudfront_distribution_name
  ssl-minimum-protocol-version = var.ssl_minimum_protocol_version
  tags                         = var.tags
}
