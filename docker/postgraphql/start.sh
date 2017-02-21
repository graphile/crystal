#!/bin/bash
set -e
postgraphql postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@pg:5432 --schema $PG_SCHEMA --development -n 0.0.0.0