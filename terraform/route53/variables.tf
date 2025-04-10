variable "project_name" {
  description = "Project name for tagging"
  type        = string
}

variable "root_domain" {
  description = "Root domain (e.g., example.com)"
  type        = string
}

variable "subdomain" {
  description = "Subdomain to configure (e.g., www)"
  type        = string
}

variable "target_domain" {
  description = "DNS record value (e.g., CloudFront or S3 endpoint)"
  type        = string
}

variable "target_record_type" {
  description = "DNS record type"
  type        = string
  default     = "CNAME"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}
