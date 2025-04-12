output "record_fqdn" {
  value       = aws_route53_record.this.fqdn
  description = "Fully-qualified domain name of the Route53 record"
}
