variable "aws_region" {
  description = "The AWS region to create the Route 53 record in"
  type        = string
}

variable "root_domain" {
  description = "The root domain (e.g., example.com)"
  type        = string
}

variable "subdomain" {
  description = "The subdomain to create (e.g., www, app)"
  type        = string
}

variable "target_record_type" {
  description = "DNS record type (e.g., A, CNAME)"
  type        = string
  default     = "CNAME"
}

variable "target_domain" {
  description = "The target domain for the DNS record (e.g., CloudFront or S3 endpoint)"
  type        = string
}

variable "ttl" {
  description = "The TTL (time to live) for the DNS record"
  type        = number
  default     = 300
}

variable "environment" {
  description = "Environment name for tagging"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name for tagging resources"
  type        = string
}
