# @graphile/lds

Logical decoding server for PostGraphile. (Can also act as a library with no server.)

Connects to a database and streams logical decoding events to interested parties.

**NOTICE**: If you're just getting started, [refer to `@graphile/subscriptions-lds` instead](https://www.npmjs.com/package/@graphile/subscriptions-lds)

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask
all individuals and businesses that use it to help support its ongoing
maintenance and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="http://chads.website/"><img src="https://www.graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a></td>
<td align="center"><a href="https://timescale.com/"><img src="https://www.graphile.org/images/sponsors/timescale.svg" width="90" height="90" alt="Timescale" /><br />Timescale</a></td>
</tr></table>

<!-- SPONSORS_END -->

## Requirements

We currently only support PG10+; if you need support for 9.x please get in
touch.

You need `wal2json`; this is available on:

- Amazon RDS
- (please send a PR adding more compatible providers)

If you don't already have it, you can install it. On your Unix-based OS (assuming `pg_config` is in your path, and points to the correct PostgreSQL installation) you can add it in a few seconds with:

```bash
git clone https://github.com/eulerto/wal2json.git
cd wal2json
USE_PGXS=1 make
USE_PGXS=1 make install
```

(No need to restart PostgreSQL)

## PostgreSQL configuration

In your `postgresql.conf` you need to ensure that the following settings are set:

```
wal_level = logical
max_wal_senders = 10
max_replication_slots = 10
```

(You can set max_wal_senders and max_replication_slots to a number at least 1.)

You can determine if your PostgreSQL instance is configured correctly with this:

```sql
DO $$
BEGIN
  if current_setting('wal_level') is distinct from 'logical' then
    raise exception 'wal_level must be set to ''logical'', your database has it set to ''%''. Please edit your `%` file and restart PostgreSQL.', current_setting('wal_level'), current_setting('config_file');
  end if;
  if (current_setting('max_replication_slots')::int >= 1) is not true then
    raise exception 'Your max_replication_slots setting is too low, it must be greater than 1. Please edit your `%` file and restart PostgreSQL.', current_setting('config_file');
  end if;
  if (current_setting('max_wal_senders')::int >= 1) is not true then
    raise exception 'Your max_wal_senders setting is too low, it must be greater than 1. Please edit your `%` file and restart PostgreSQL.', current_setting('config_file');
  end if;
  perform pg_create_logical_replication_slot('compatibility_test', 'wal2json');
  perform pg_drop_replication_slot('compatibility_test');
  raise notice 'Everything seems to be in order.';
end;
$$ LANGUAGE plpgsql;
```

If you see the following message then all should be good:

```
NOTICE:  00000: Everything seems to be in order.
```

## Environmental variables

I've not put any argument parsing into this yet, so everything's done with envvars:

Required:

- `LD_DATABASE_URL` - the database URL to connect to for logical decoding; must have permission to create the logical replication slot

Optional:

- `LD_TABLE_PATTERN` - optional setting, allows us to ignore changes in tables you don't care about; default: '_._', recommended: 'app_public.\*' (assuming your PostGraphile schema is called 'app_public').
- `LD_PORT` / `PORT` - the port number to run this server on, defaults to `9876`
- `LD_HOST` - the host name to listen on, defaults to `127.0.0.1` (set to `0.0.0.0` to listen on all interfaces, e.g. if running inside of Docker)

Very optional:

- `LD_SLOT_NAME` - optional name of the logical decoding slot to use, we use `postgraphile` by default. Be sure to drop the old slot (see below) if you change this.
- `LD_MAX_CLIENTS` - set to the maximum number of clients to allow to connect to the server. Defaults to `50`. (Each PostGraphile instance counts as one client.)
- `LD_WAIT` - duration in milliseconds to pause between logical decoding polls; defaults to `200`, reduce for lower latency but higher CPU usage.

## Running

This package installs the `graphile-lds` command. If you installed it globally you should be able to execute it directly, otherwise we advise you run `npx` to run it:

`LD_DATABASE_URL="postgres://localhost/my_db" npx graphile-lds`

## Cleaning up

It's essential that you drop the logical replication slot when you no longer
need it, otherwise your disk will fill up. PostgreSQL does this for you with
slots marked as "temporary", but for normal slots you must do this manually:

```sql
SELECT pg_drop_replication_slot('postgraphile'); -- or whatever slot name you were using.
```

(It's okay to keep the slot active whilst you're running the LDS because
we'll keep consuming the data and it'll be cleared automatically. It's only
when LDS isn't running that data will build up.)
