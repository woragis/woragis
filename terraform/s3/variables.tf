variable "project_name" {
  description = "Project name used for tagging and naming resources"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., dev, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "s3_bucket_name" {
  description = "Custom name for the S3 bucket (optional)"
  type        = string
  default     = "null"
}
