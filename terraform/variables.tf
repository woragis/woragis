variable "project_name" {
  type        = string
  description = "Project name used for naming resources and tags"
}

variable "root_domain" {
  type        = string
  description = "Main domain for the application (e.g., example.com)"
}

variable "aws_region" {
  type        = string
  description = "AWS region to deploy all resources"
}

variable "environment" {
  type        = string
  description = "Deployment environment (e.g., dev, staging, prod)"
}
