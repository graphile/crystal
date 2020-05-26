#!/usr/bin/env bash
set -e

# This setup script is heavily inspired by
# https://github.com/debezium/docker-images/blob/master/postgres/11/Dockerfile

PROTOC_VERSION=1.3
WAL2JSON_COMMIT_ID=c54d89649c3fe5e0aa79c3a87493935232e962a7
USE_PGXS=1
export PGUSER=postgres
export PGPASSWORD=postgres
createuser --superuser root

apt-get update
apt-get install -f -y --no-install-recommends \
        software-properties-common \
        build-essential \
        pkg-config \
        git \
        postgresql-server-dev-$PG_MAJOR
add-apt-repository "deb http://ftp.debian.org/debian testing main contrib"
apt-get update
rm -rf /var/lib/apt/lists/*

cd /
git clone https://github.com/eulerto/wal2json -b master --single-branch
cd wal2json
git checkout $WAL2JSON_COMMIT_ID
make
make install
cd ..
rm -rf wal2json
