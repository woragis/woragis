output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.cdn.cloudfront_domain_name
}

output "full_domain" {
  description = "The full domain name (subdomain + root)"
  value       = module.cdn.full_domain
}

output "zone_id" {
  description = "Route53 zone ID (from primary zone data source)"
  value       = module.cdn.zone_id
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.cdn.cloudfront_distribution_id
}
