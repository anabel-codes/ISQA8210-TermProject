#!/usr/bin/env bash
set -euo pipefail

# Render mounts persistent disks only at runtime. Build against a disposable DB.
build_data=$(mktemp -d)
trap 'rm -rf "$build_data"' EXIT
export DATABASE_URL="file:$build_data/build.db"
npm ci --include=dev
# Prisma's SQLite migration engine requires info-level initialization logging.
RUST_LOG=info npm run db:migrate
npm run build
