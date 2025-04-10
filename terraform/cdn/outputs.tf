output "cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.this.domain_name
  description = "Domain name of the CloudFront distribution"
}

output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.this.id
  description = "ID of the CloudFront distribution"
}
