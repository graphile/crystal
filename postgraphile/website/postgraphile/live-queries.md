---
layout: page
path: /postgraphile/live-queries/
title: Live Queries
draft: true
---

:::caution

This documentation is copied from Version 4 and has not been updated to Version
5 yet; it may not be valid.

:::

<p class='intro'>
A “live query” monitors the query a user provides and gives the client an updated version whenever the query would return a different result.
</p>

_This feature requires PostGraphile v4.4.0 or higher._

### What are live queries?

You can think of live queries as akin to extremely frequent polling of a regular
query, but without the bandwidth costs. Live queries are not yet an official
feature of GraphQL, and so there are a number of different implementations.
PostGraphile’s live queries do not require specific client software since we use
the standard GraphQL subscriptions interface — simply change your `query` to a
`subscription` and it becomes live, as in the following example
([available on GitHub](https://github.com/graphile/livesotope)) showing
real-time points rankings of fictional players:

<div class="tc">
<img alt="Changing a query to a live query" src="/images/query2subscription.png" style={{maxHeight: '230px'}} />
</div>

<p></p>

<div class="tc">
<img alt="Demo of live query" src="/images/live_demo_rankings.gif" />
</div>

Live queries are an incredibly powerful tool for frontend developers, as it
means they don’t need to worry about monitoring for changes in the data — they
know the data they’ve requested will always be up to date. However, live queries
are not a panacea: they can come with significant backend cost and/or
complexity.

One way to achieve 100% accurate live queries is to run the users query over and
over on the server side, and send an update whenever the results change. This,
however, is not very efficient and puts an excessive load on the server.

### Live queries via logical decoding

PostGraphile supports "realtime provider plugins" to source information about
when data changes. Our initial official realtime provider plugin,
`@graphile/subscriptions-lds`, monitors a “logical replication slot” from
PostgreSQL (this is similar to the system that PostgreSQL read-replicas use to
stay up to date with the primary database). This allows us to determine relevant
changes without putting too much additional load on the database.

However, we must re-run the user's query to see if anything else (e.g. computed
values from functions, views, plugins, etc; reordering of results; effects on
pagination) has changed before returning the updated data to the user.
Therefore, it’s best to keep live queries small and simple: the more complex the
query, the more sources of change it has (so updates may happen more
frequently), and the longer it will take to execute.

### When (not) to use live queries

PostGraphile has worked hard to decrease the costs associated with live queries,
but there’s still more to be done. Currently we feel PostGraphile live queries
may be suitable in apps with relatively small user bases (such as for internal
tooling used across a large enterprise), but if you’re targeting an internet
scale deployment hoping for millions of users you will likely be better off
using [subscriptions](./subscriptions/), or keeping live queries to a very small
area of your application.

One particular problem to be aware of is the "thundering herd" — if thousands of
users are all subscribed to the same data, and that data is updated, then
thousands of SQL queries will be issued against the database at the same time.
This issue can be lessened by ensuring that live queries only apply to a subset
of users at a time.

### Enabling live queries

To enable live queries support in PostGraphile, you will need:

- to pass `--live` (or `live: true`)
- to provide a plugin that can inform PostGraphile of realtime changes

### Realtime provider plugins

You may track changes to your database data in many ways, for example using
database triggers and LISTEN/NOTIFY, using logical decoding, or even by
streaming from an external source such as Kafka.

Currently we have one first-party realtime provider plugin,
`@graphile/subscriptions-lds`:

#### @graphile/subscriptions-lds

This plugin uses the Logical Decoding features of PostgreSQL to get a stream of
data changes very efficiently from the database (using its replication
interface). When a change occurs, if any of the live queries would be affected
by it, they're informed of the change and PostGraphile re-runs the query and
sends the results to the client - this ensures that database permissions are
always respected, and that no caching issues occur.

To enable this plugin, you must alter your PostgreSQL configuration
`postgresql.conf` and ensure that the following settings are enabled:

```
wal_level = logical
max_wal_senders = 10
max_replication_slots = 10
```

You must also install the `wal2json` extension into PostgreSQL if you don't
already have it (normally takes under 10 seconds):

```
git clone https://github.com/eulerto/wal2json.git
cd wal2json
USE_PGXS=1 make
USE_PGXS=1 make install
```

Now PostgreSQL is ready, you can enable live queries support in PostGraphile.
First, install the plugin:

```
yarn add @graphile/subscriptions-lds
```

Because of the power the replication interface gives, it's necessary to use a
superuser or database owner account, so in addition to your normal connection
string you must also pass an "owner" connection string which has elevated
privileges. (If you're not using RLS/etc and normally use PostGraphile with a
superuser/database owner account then this is unnecessary.)

On the CLI:

```
postgraphile \
  --connection postgres://postgraphile_user:postgraphile_pass@host/db \
  --live \
  --owner-connection postgres://db_owner:db_owner_pass@host/db \
  --append-plugins @graphile/subscriptions-lds \
  ...
```

Via the library:

```js
app.use(
  postgraphile(process.env.AUTH_DATABASE_URL, SCHEMA, {
    // ...

    // Enable live support in PostGraphile
    live: true,
    // We need elevated privileges for logical decoding
    ownerConnectionString: process.env.ROOT_DATABASE_URL,
    // Add this plugin
    appendPlugins: [
      //...
      require("@graphile/subscriptions-lds").default,
    ],
  }),
);
```

Then to make a query live, you simply turn it into a subscription, e.g.

```graphql
{
  allPeople {
    nodes {
      name
    }
  }
}
```

would become:

```graphql
subscription {
  allPeople {
    nodes {
      name
    }
  }
}
```

More detailed instructions are available in the
[@graphile/subscriptions-lds README](https://www.npmjs.com/package/@graphile/subscriptions-lds).

### Configuration

You can configure the live query support with the following environmental
variables:

#### `LD_WAIT` (default 125)

This environmental variable controls how often in milliseconds we check for
changes from the database. Setting it smaller leads to more timely updates but
increases overhead. Setting it larger increases efficiency but means each batch
takes longer to process which may slow the Node.js event loop.

#### `LIVE_THROTTLE` (default 500)

This environmental variable is the minimum duration in milliseconds between live
updates to the same subscription.

If your server is getting overwhelmed, you may increase this to increase the
period between live updates sent to clients.

If your application is not responsive enough, you may decrease this to get
closer to real-time updates.

(Throttle fires on both the leading and trailing edge, so decreasing this only
affects successive updates, not the initial update.)

#### `LD_TABLE_PATTERN` (default "\*.\*")

Set this envvar to e.g. `app_public.*` to only monitor tables in the
`app_public` schema. See
[`filter-tables` in the wal2json documentation](https://github.com/eulerto/wal2json#parameters).
This should increase performance by ignoring irrelevant data.

### Performance

Live queries are a lot more expensive than regular subscriptions — the server
must monitor a lot more sources to detect a change (monitoring each individual
record returned, plus monitoring for additions/removals from any collection
including filtering constraints), and changes will most likely be more frequent
as they're coming from multiple sources. Use live queries with care - it's wise
to keep the queries as small as possible since they must be recalculated any
time anything within the query results changes.

Logical decoding uses a "logical" PostgreSQL replication slot (replication slots
are the technology behind how PostgreSQL read replicas stay up to date with the
primary). We poll this slot for changes using the efficient
`pg_logical_slot_get_changes` API in PostgreSQL. When a change is detected, we
check to see if this change is relevant to any of the running live queries, and
if so we tell that live query to refetch its data.

This refetching process requires the query to be executed again (in order for us
to ensure any requested data still matches the permissions you have set via RLS,
and to ensure that no old (cached) data can make the request
inconsistent/stale). However, it does come at a cost as any relevant data may
trigger multiple (or _all_) connected clients to all request the same data at
the same time (the "thundering herd" problem). We solve this slightly by giving
each client their own throttled callback, so the callbacks are offset. There's a
lot more that can be done to optimise our logical decoding support, so if you
get to a point where logical decoding performance is an issue, please get in
touch!

Optimisation steps you can take currently:

- Whitelist (or otherwise limit) the live queries that your system may perform
- Only write small non-overlapping live queries - since the entire query must
  run again on change it's better to have 20 small queries than one large one
  (quite the opposite to normal queries!)
- Use `LD_TABLE_PATTERN` to ignore irrelevant data
- Increase `LIVE_THROTTLE` and/or `LD_WAIT` to reduce the frequency data is
  recalculated
- Move the logical decoding system to a dedicated server
- Add more `liveConditions` to queries to filter rows the user may not see so
  that they do not trigger live updates for that user (TODO: document this!)
- Use read replicas [PRO]

We do not currently recommend live queries for very large deployments - if
you're expecting tens of thousands of concurrent users it's going to be
significantly more efficient to use regular [subscriptions](./subscriptions/)

### Scaling

Once you reach beyond a few PostGraphile instances you'll want to make your live
decoding usage more efficient. We support this by allowing you to run a
dedicated live decoding server (LDS) and have PostGraphile instances connect to
this server. You can use the `LDS_URL` envvar to tell PostGraphile where to find
this shared server. To set up the server, follow the instructions in the
[@graphile/lds](https://github.com/graphile/graphile-engine/blob/master/packages/lds/README.md)
project. When running LDS standalone like this, there are more options for
configuring it.

### Inflection

By default, live fields use the same names as fields in the `Query` type;
however these field names are sent through the `live` inflector so you may
customise these if you wish using [the inflection system](./inflection/).

### Limitations

Note that each live provider plugin has its own limitations, and may not be able
to detect all changes. For example `@graphile/subscriptions-lds` can detect
changes to results queried from tables, but cannot currently detect changes to
results queried from views and functions. In particular, computed columns are
not kept up to date (although they are re-calculated whenever a table update
triggers the subscription). Monitored tables must also use primary keys.

### Amazon RDS

Configuring Live Queries on Amazon RDS is slightly different, as it's a managed
service. (Also note that RDS runs a slightly out-of-date `wal2json`.)

To set up your RDS server:

- Go to 'Parameter groups' in the AWS management console and change the
  `rds.logical_replication` setting to `1`, then reboot your database
- Connect to the RDS server as your superuser and
  `grant rds_replication to DB_OWNER;` where `DB_OWNER` is the name of the
  PostgreSQL role that created your database.
