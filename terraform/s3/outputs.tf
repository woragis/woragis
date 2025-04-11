output "s3_bucket_name" {
  value       = module.s3.s3_bucket_name
  description = "Name of the S3 bucket hosting the static site"
}

output "website_endpoint" {
  value       = module.s3.website_endpoint
  description = "S3 website endpoint"
}
