provider "aws" {
  region = var.aws_region
}

module "react" {
  source             = "git::https://github.com/woragis/terraform-react.git//?ref=v1"
  aws_region         = var.aws_region
  project_name       = var.project_name
  environment        = var.environment
  # s3_bucket_name     = var.s3_bucket_name
  # logging_bucket_name = var.logging_bucket_name
}
