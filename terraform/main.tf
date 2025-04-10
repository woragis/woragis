module "react_app" {
  source = "git::https://github.com/woragis/terraform-react.git//?ref=v1"

  project_name = var.project_name
  root_domain  = var.root_domain
  environment  = var.environment
  aws_region   = var.aws_region

  # Optional variables with fallback logic
  s3_bucket_name              = ""
  logging_bucket_name         = ""
  cloudfront_distribution_name = ""
  route53_zone_id             = "" # optional but keep it clean
}
