#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?Set the persistent database URL}"
: "${MEDIA_ROOT:?Set the persistent media directory}"
: "${NEXTAUTH_URL:?Set the public HTTPS origin}"
: "${NEXTAUTH_SECRET:?Set the session secret}"
mkdir -p "$MEDIA_ROOT"
# Migrate here because the persistent disk is unavailable during pre-deploy.
RUST_LOG=info npm run db:migrate
exec node node_modules/next/dist/bin/next start --hostname 0.0.0.0 --port "${PORT:-10000}"
