provider "aws" {
  region = var.aws_region
}

module "route53" {
  source             = "git::https://github.com/woragis/terraform-route53.git//?ref=v1"
}
