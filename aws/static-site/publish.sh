#!/usr/bin/env bash
# Upload ./dist to the site bucket and invalidate CloudFront.
# Usage: publish.sh <bucket> <distribution-id> [dist-dir]
# Used by GitHub Actions and for manual deploys.
set -euo pipefail
BUCKET=$1 DIST_ID=$2 DIR=${3:-dist}

# Hashed build assets: cache forever.
aws s3 sync "$DIR/assets" "s3://$BUCKET/assets" --delete \
  --cache-control 'public,max-age=31536000,immutable'

# Everything else (index.html, images, fonts): short cache, always revalidate HTML.
aws s3 sync "$DIR" "s3://$BUCKET" --delete --exclude 'assets/*' --exclude 'index.html' \
  --cache-control 'public,max-age=86400'
aws s3 cp "$DIR/index.html" "s3://$BUCKET/index.html" \
  --cache-control 'no-cache' --content-type 'text/html; charset=utf-8'

aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths '/*' \
  --query 'Invalidation.Id' --output text
