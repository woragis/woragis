output "s3_bucket_name" {
  value       = module.react.s3_bucket_name
  description = "Name of the S3 bucket hosting the static site"
}

output "logging_bucket_name" {
  value       = module.react.logging_bucket_name
  description = "Name of the S3 bucket for logging"
}

output "website_endpoint" {
  value       = module.react.website_endpoint
  description = "S3 website endpoint"
}
