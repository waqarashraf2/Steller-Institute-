#!/usr/bin/env bash
set -euo pipefail

TARGET_HOST="${CPANEL_HOST:-stellarinstitute}"
TARGET_PATH="public_html"

echo "=== Building project ==="
npm run build

echo "=== Verifying SSH connection to $TARGET_HOST ==="
ssh -o BatchMode=yes -o ConnectTimeout=5 "$TARGET_HOST" "echo Connected to cPanel"

echo "=== 1. Deploying compiled assets (replacing stale hashes) ==="
rsync -avz --delete dist/assets/ "$TARGET_HOST":"$TARGET_PATH/assets/"

echo "=== 2. Deploying API handlers ==="
rsync -avz api/ "$TARGET_HOST":"$TARGET_PATH/api/"

echo "=== 3. Deploying root website files (preserving all subdomains) ==="
rsync -avz --exclude='assets' dist/ "$TARGET_HOST":"$TARGET_PATH/"

echo "=== Deployment to $TARGET_HOST completed successfully ==="
