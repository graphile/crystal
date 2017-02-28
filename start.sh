#!/bin/bash
set -e
postgraphql -c postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@pgb:6432 --schema $PG_SCHEMA -n 0.0.0.0 -p 3000
