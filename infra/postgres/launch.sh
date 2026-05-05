#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PROJECT_NAME="sotsial"
COMPOSE_FILE="$ROOT_DIR/infra/postgres/compose.yml"

cleanup() {
  # stop + remove containers; keep named volumes by default
  docker compose -p "$PROJECT_NAME" -f "$COMPOSE_FILE" down --remove-orphans >/dev/null 2>&1 || true
}

trap cleanup INT TERM EXIT

docker compose -p "$PROJECT_NAME" -f "$COMPOSE_FILE" up -d --remove-orphans

# optional: wait until Postgres is accepting connections
docker compose -p "$PROJECT_NAME" -f "$COMPOSE_FILE" exec -T postgres \
  bash -lc 'until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do sleep 0.2; done'

echo "Postgres is up on localhost:6432. Press Ctrl+C to stop."
while :; do sleep 1; done
