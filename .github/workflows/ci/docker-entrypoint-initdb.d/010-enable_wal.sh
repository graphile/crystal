#!/usr/bin/env bash
set -e

echo -e 'wal_level = logical\nmax_replication_slots = 10\nmax_wal_senders = 10' >> /var/lib/postgresql/data/postgresql.conf
