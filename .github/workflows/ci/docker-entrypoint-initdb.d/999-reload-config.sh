#!/usr/bin/env bash
set -e

psql -U postgres -c "SELECT pg_reload_conf();"
