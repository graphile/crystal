#!/usr/bin/env bash
set -e

su -c "createdb graphileengine_test" postgres
su -c "createdb postgraphile_test" postgres

