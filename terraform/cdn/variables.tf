variable "project_name" {
  description = "Project name for naming and tagging"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "origin_domain_name" {
  description = "Origin domain name (usually the S3 website endpoint)"
  type        = string
}

variable "logging_bucket_domain_name" {
  description = "Logging bucket domain name"
  type        = string
}

variable "cloudfront_distribution_name" {
  description = "Optional custom name for the distribution"
  type        = string
  default     = "null"
}

variable "ssl_minimum_protocol_version" {
  description = "TLS version"
  type        = string
  default     = "TLSv1.2_2021"
}

variable "tags" {
  description = "Extra tags (JSON map)"
  type        = map(string)
  default     = {}
}
