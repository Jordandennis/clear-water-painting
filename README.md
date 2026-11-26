# Clear Water Painting

![Clear Water Painting logo, created by Kylea Archer](../public/images/Clear_Water_Painting-A_edited.png)

Landing page for [Clear Water Painting](https://clearwaterpainting.ca), a residential and commercial painting company based in Courtenay, British Columbia.

---

## Overview

This project started as a practical problem: the business was paying for a Wix subscription that was cost-prohibitive for a small seasonal company, and the platform provided no flexibility over the frontend, backend, or infrastructure. The goal was to migrate to a fully self-managed stack — custom HTML/CSS/JS frontend hosted on AWS — with a longer-term plan to rebuild in React.

---


## Roadmap

The frontend is being rebuilt as a React application before being redeployed. The planned stack for v2:

- **React** — component-based frontend
- **AWS S3 + CloudFront** — static hosting (migrated off EC2 + NGINX, Nov 2026)

---

## Background

### Why migrate away from Wix?

Wix worked as a starting point but had two core problems: the monthly cost didn't make sense for a business that operates seasonally, and there was no way to own the infrastructure or extend the application beyond what the platform allowed. Moving to a custom AWS setup eliminated the recurring platform cost and gave full control over how the site is built, served, and scaled.

### AWS setup

The site is a static Vite build served from a private S3 bucket through CloudFront (Origin Access Control, ACM certificate, `www` → apex redirect). Route 53 handles DNS. The warranty form posts to a separate API Gateway + Lambda + SES stack (`aws/warranty-form`).

Pushes to `main` deploy via GitHub Actions using OIDC — no stored AWS keys. The workflow needs these repository **variables** (Settings → Secrets and variables → Actions → Variables): `AWS_DEPLOY_ROLE_ARN`, `SITE_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID` (all are outputs of the `clear-water-static-site` stack in us-east-1).

```
aws/static-site/deploy-stack.sh            # create/update infra (us-east-1)
aws/static-site/publish.sh <bucket> <id>   # manual deploy of ./dist
aws/static-site/cutover-dns.sh cloudfront  # point DNS at CloudFront (or: rollback <ec2-ip>)
```

---

*Logo designed by Kylea Archer.*
