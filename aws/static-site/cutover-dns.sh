#!/usr/bin/env bash
# Point apex + www at CloudFront (UPSERT = atomic swap, no gap), or roll back to EC2.
# Usage: cutover-dns.sh cloudfront     # switch to CloudFront
#        cutover-dns.sh rollback <ip>  # restore A records to the EC2 IP, remove AAAA
set -euo pipefail
cd "$(dirname "$0")"

STACK=${STACK:-clear-water-static-site}
DOMAIN=${DOMAIN:-clearwaterpainting.ca}
CF_ZONE=Z2FDTNDATAQYW2   # fixed hosted zone ID for all CloudFront aliases
ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name "$DOMAIN" \
  --query 'HostedZones[0].Id' --output text | sed 's#/hostedzone/##')

alias_change() { # action name type target
  printf '{"Action":"%s","ResourceRecordSet":{"Name":"%s","Type":"%s","AliasTarget":{"HostedZoneId":"%s","DNSName":"%s","EvaluateTargetHealth":false}}}' \
    "$1" "$2" "$3" "$CF_ZONE" "$4"
}

case ${1:-} in
  cloudfront)
    CF=$(aws cloudformation describe-stacks --region us-east-1 --stack-name "$STACK" \
      --query "Stacks[0].Outputs[?OutputKey=='DistributionDomainName'].OutputValue" --output text)
    CHANGES=""
    for name in "$DOMAIN" "www.$DOMAIN"; do
      for type in A AAAA; do
        CHANGES+="$(alias_change UPSERT "$name." "$type" "$CF"),"
      done
    done
    ;;
  rollback)
    IP=${2:?EC2 IP required}
    CF=$(aws cloudformation describe-stacks --region us-east-1 --stack-name "$STACK" \
      --query "Stacks[0].Outputs[?OutputKey=='DistributionDomainName'].OutputValue" --output text)
    CHANGES=""
    for name in "$DOMAIN" "www.$DOMAIN"; do
      CHANGES+=$(printf '{"Action":"UPSERT","ResourceRecordSet":{"Name":"%s.","Type":"A","TTL":300,"ResourceRecords":[{"Value":"%s"}]}},' "$name" "$IP")
      CHANGES+="$(alias_change DELETE "$name." AAAA "$CF."),"
    done
    ;;
  *) echo "usage: $0 cloudfront | rollback <ec2-ip>" >&2; exit 1 ;;
esac

aws route53 change-resource-record-sets --hosted-zone-id "$ZONE_ID" \
  --change-batch "{\"Comment\":\"$1\",\"Changes\":[${CHANGES%,}]}" \
  --query 'ChangeInfo.[Id,Status]' --output text
