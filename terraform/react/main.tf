provider "aws" {
  region = var.aws_region
}

module "react" {
  source             = "git::https://github.com/woragis/terraform-react.git//?ref=v1"
  project-name       = var.project_name
  terraform-dir      = "./"
  aws-region         = var.aws_region
  environment        = var.environment
  s3-bucket-name     = var.s3_bucket_name
  logging-bucket-name = var.logging_bucket_name
}
