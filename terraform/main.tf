module "react_app" {
  source = "git::https://github.com/woragis/terraform-react.git//?ref=v1"

  project_name = "WoragisWebsite"
  root_domain = "woragis.com"
  subdomain = "www"
  aws_region = "us-east-1"
}
