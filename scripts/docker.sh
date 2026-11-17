#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

if [ "$#" -eq 0 ]; then
    printf 'Usage: sh scripts/docker.sh <compose command> [arguments...]\n\n'
    printf 'Develop (auto sync): sh scripts/docker.sh dev\n'
    printf 'Start snapshot:     sh scripts/docker.sh up -d --build\n'
    printf 'Status: sh scripts/docker.sh ps\n'
    printf 'Logs:   sh scripts/docker.sh logs -f app\n'
    printf 'Stop:   sh scripts/docker.sh down\n'
    exit 0
fi

if [ "${1:-}" = "dev" ]; then
    shift
    set -- up --watch "$@"
fi

if [ -f .env.docker ]; then
    exec docker compose --env-file .env.docker -f compose.yaml "$@"
fi

exec docker compose -f compose.yaml "$@"
