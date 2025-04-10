module "react_app" {
  source = "git::https://github.com/woragis/terraform-react.git//?ref=v1"

  project_name = var.project_name
  root_domain  = var.root_domain
  environment  = var.environment
  aws_region   = var.aws_region
}
