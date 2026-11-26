#!/usr/bin/env bash
# Create/update the static-site stack. Safe to re-run; does not touch DNS records
# (other than the ACM validation CNAMEs it adds automatically).
set -euo pipefail
cd "$(dirname "$0")"

STACK=${STACK:-clear-water-static-site}
DOMAIN=${DOMAIN:-clearwaterpainting.ca}
ZONE_ID=${ZONE_ID:-$(aws route53 list-hosted-zones-by-name --dns-name "$DOMAIN" \
  --query 'HostedZones[0].Id' --output text | sed 's#/hostedzone/##')}

aws cloudformation deploy \
  --region us-east-1 \
  --stack-name "$STACK" \
  --template-file template.yaml \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset \
  --parameter-overrides DomainName="$DOMAIN" HostedZoneId="$ZONE_ID" "$@"

aws cloudformation describe-stacks --region us-east-1 --stack-name "$STACK" \
  --query 'Stacks[0].Outputs' --output table
