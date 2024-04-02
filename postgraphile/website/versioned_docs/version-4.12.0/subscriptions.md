---
layout: page
path: /postgraphile/subscriptions/
title: GraphQL Subscriptions
---

<p class='intro'>
Subscriptions notify you when an event occurs on the server side.
</p>

_This feature requires PostGraphile v4.4.0 or higher._

### Introduction

Pass `--subscriptions` (or `subscriptions: true`) to PostGraphile and we'll
enhance GraphiQL with subscription capabilities and give your PostGraphile
server the power of websocket communications. This will enable the websocket
endpoint.

Although you can now use `makeExtendSchemaPlugin` to add your own subscription
fields using your own realtime events, it's likely that you'll want to add the
[`@graphile/pg-pubsub` realtime provider plugin](https://www.npmjs.com/package/@graphile/pg-pubsub)
so that you can leverage PostgreSQL's built-in pubsub support. For example, this
plugin will allow `makeExtendSchemaPlugin` to use the `@pgSubscriptions`
directive to easily define your own subscriptions using PostgreSQL's
`LISTEN`/`NOTIFY` (recommended for production). This plugin also adds the
`--simple-subscriptions` flag that can be used to add a simple listen
subscription field to your GraphQL API (useful for experimentation). See below
how to enable the plugin for each approach.

If you just use the `--subscriptions` flag alone, you'll notice that your schema
still only has `query` and `mutation` operation types. To add subscriptions to
your GraphQL schema you'll need a plugin to provide the relevant `subscription`
fields (by extending the `Subscription` type) - or you can write your own
[with `makeExtendSchemaPlugin`](./make-extend-schema-plugin/).

The easiest way to get started is with Simple Subscriptions (see below) but we
recommend that you take the Custom Subscriptions approach as it allows you to be
much more expressive about the realtime features of your GraphQL API.

NOTE: the endpoint for subscriptions is the same as for GraphQL, except the
protocol is changed from `http` or `https` to `ws` or `wss` respectively.

---

### Custom Subscriptions

In this implementation, you use PostGraphile's extensibility to define the exact
subscriptions you need.

#### Writing the plugin

Using `makeExtendSchemaPlugin` we can define a new subscription field and the
subscription payload type that it returns. Using the
`@pgSubscription(topic: ...)` directive provided by `@graphile/pg-pubsub` we can
embed a function that will calculate the PostgreSQL topic to subscribe to based
on the arguments and context passed to the GraphQL field (in this case factoring
in the user ID).

```js
// MySubscriptionPlugin.js
const { makeExtendSchemaPlugin, gql, embed } = require("graphile-utils");
// or: import { makeExtendSchemaPlugin, gql, embed } from 'graphile-utils';

const currentUserTopicFromContext = async (_args, context, _resolveInfo) => {
  if (context.jwtClaims.user_id) {
    return `graphql:user:${context.jwtClaims.user_id}`;
  } else {
    throw new Error("You're not logged in");
  }
};

module.exports = makeExtendSchemaPlugin(({ pgSql: sql }) => ({
  typeDefs: gql`
    type UserSubscriptionPayload {
      # This is populated by our resolver below
      user: User

      # This is returned directly from the PostgreSQL subscription payload (JSON object)
      event: String
    }

    extend type Subscription {
      """
      Triggered when the current user's data changes:

      - direct modifications to the user
      - when their organization membership changes
      """
      currentUserUpdated: UserSubscriptionPayload @pgSubscription(topic: ${embed(
        currentUserTopicFromContext,
      )})
    }
  `,

  resolvers: {
    UserSubscriptionPayload: {
      // This method finds the user from the database based on the event
      // published by PostgreSQL.
      //
      // In a future release, we hope to enable you to replace this entire
      // method with a small schema directive above, should you so desire. It's
      // mostly boilerplate.
      async user(
        event,
        _args,
        _context,
        { graphile: { selectGraphQLResultFromTable } },
      ) {
        const rows = await selectGraphQLResultFromTable(
          sql.fragment`app_public.users`,
          (tableAlias, sqlBuilder) => {
            sqlBuilder.where(
              sql.fragment`${tableAlias}.id = ${sql.value(event.subject)}`,
            );
          },
        );
        return rows[0];
      },
    },
  },
}));
```

<details>
<summary>
I'm using a fairly complex PostgreSQL function so that I can just use `CREATE TRIGGER` to trigger events in future without having to define a function for
each trigger. Click this paragraph to expand and see the function.
</summary>

```sql
create function app_public.graphql_subscription() returns trigger as $$
declare
  v_process_new bool = (TG_OP = 'INSERT' OR TG_OP = 'UPDATE');
  v_process_old bool = (TG_OP = 'UPDATE' OR TG_OP = 'DELETE');
  v_event text = TG_ARGV[0];
  v_topic_template text = TG_ARGV[1];
  v_attribute text = TG_ARGV[2];
  v_record record;
  v_sub text;
  v_topic text;
  v_i int = 0;
  v_last_topic text;
begin
  -- On UPDATE sometimes topic may be changed for NEW record,
  -- so we need notify to both topics NEW and OLD.
  for v_i in 0..1 loop
    if (v_i = 0) and v_process_new is true then
      v_record = new;
    elsif (v_i = 1) and v_process_old is true then
      v_record = old;
    else
      continue;
    end if;
     if v_attribute is not null then
      execute 'select $1.' || quote_ident(v_attribute)
        using v_record
        into v_sub;
    end if;
    if v_sub is not null then
      v_topic = replace(v_topic_template, '$1', v_sub);
    else
      v_topic = v_topic_template;
    end if;
    if v_topic is distinct from v_last_topic then
      -- This if statement prevents us from triggering the same notification twice
      v_last_topic = v_topic;
      perform pg_notify(v_topic, json_build_object(
        'event', v_event,
        'subject', v_sub
      )::text);
    end if;
  end loop;
  return v_record;
end;
$$ language plpgsql volatile set search_path from current;
```

</details>

Hooking the database up to a GraphQL subscription is now just the case of
`CREATE TRIGGER`:

```sql
CREATE TRIGGER _500_gql_update
  AFTER UPDATE ON app_public.users
  FOR EACH ROW
  EXECUTE PROCEDURE app_public.graphql_subscription(
    'userChanged', -- the "event" string, useful for the client to know what happened
    'graphql:user:$1', -- the "topic" the event will be published to, as a template
    'id' -- If specified, `$1` above will be replaced with NEW.id or OLD.id from the trigger.
  );

CREATE TRIGGER _500_gql_update_member
  AFTER INSERT OR UPDATE OR DELETE ON app_public.organization_members
  FOR EACH ROW
  EXECUTE PROCEDURE app_public.graphql_subscription('organizationsChanged', 'graphql:user:$1', 'member_id');
```

#### Enabling with the CLI

Load the `@graphile/pg-pubsub` _server_ plugin (`--plugins`, or `pluginHook` for
the library), our custom subscription _schema_ plugin (`--append-plugins`, or
`appendPlugins` for the library), and enable PostGraphile server's websockets
support with `--subscriptions` (or `subscriptions: true` for the library).

```
postgraphile \
  --plugins @graphile/pg-pubsub \
  --append-plugins `pwd`/MySubscriptionPlugin.js \
  --subscriptions \
  -c mydb
```

#### Enabling with an Express app

When using PostGraphile as a library, you may enable Custom Subscriptions by
passing the `pluginHook` with the `@graphile/pg-pubsub` plugin, setting
`subscriptions: true` and adding your custom plugin.

We emulate part of the Express stack, so if you require sessions you can pass
additional Connect/Express middlewares (sorry, we don't support Koa middlewares
here at this time) via the `websocketMiddlewares` option.

Here's an example:

```js
const express = require("express");
const { postgraphile, makePluginHook } = require("postgraphile");
const MySubscriptionPlugin = require("./MySubscriptionPlugin"); // our plugin defined in previous step
const { default: PgPubsub } = require("@graphile/pg-pubsub"); // remember to install through yarn/npm

const pluginHook = makePluginHook([PgPubsub]);

const postgraphileOptions = {
  pluginHook, // add the plugin hook. This will make the @pgSubscription avaiable in our schema definitions
  subscriptions: true, // start the websocket server
  appendPlugins: [MySubscriptionPlugin], // Load our plugin
  websocketMiddlewares: [
    // Add whatever middlewares you need here, note that they should only
    // manipulate properties on req/res, they must not sent response data. e.g.:
    //
    //   require('express-session')(),
    //   require('passport').initialize(),
    //   require('passport').session(),
  ],
};

const app = express();
app.use(postgraphile(databaseUrl, "app_public", postgraphileOptions));
app.listen(parseInt(process.env.PORT, 10) || 3000);
```

#### Testing your subscription with GraphiQL/GraphQL Playground

To test your subscription you will need to first subscribe and then trigger it.

To subscribe, in one GraphiQL tab execute

```graphql
subscription MySubscription {
  currentUserUpdated {
    user
    event
  }
}
```

You should get the answer: `"Waiting for subscription to yield data…"`

To trigger the subscription, _in another GraphiQL tab_ run a mutation that
changes the user. This will depend on your implementation, for example:

```graphql
mutation MyMutation {
  updateUserById(input: { userPatch: { name: "foo" }, id: 27 }) {
    clientMutationId
  }
}
```

In this tab you will get the regular mutation answer. Going back to the previous
tab, you will see the subscription payload. You are good to go! This should
serve as the basis to implement your own custom subscriptions.

---

### Simple Subscriptions

In this implementation, we have `@graphile/pg-pubsub` automatically expose a
generic `listen` handler that can be used with arbitrary topics in PostgreSQL —
it requires very little ahead-of-time planning.

#### Enabling with the CLI

To enable Simple Subscriptions via the CLI, just load the `@graphile/pg-pubsub`
plugin and pass the `--subscriptions` and `--simple-subscriptions` flags.

```
postgraphile \
  --plugins @graphile/pg-pubsub \
  --subscriptions \
  --simple-subscriptions \
  -c mydb
```

#### Enabling with an Express app

When using PostGraphile as a library, you may enable Simple Subscriptions by
passing the `pluginHook` with the `@graphile/pg-pubsub` plugin and using
`simpleSubscriptions: true`.

We emulate part of the Express stack, so if you require sessions you can pass
additional Connect/Express middlewares (sorry, we don't support Koa middlewares
here at this time) via the `websocketMiddlewares` option.

Here's an example:

```js
const express = require("express");
const { postgraphile, makePluginHook } = require("postgraphile");
const { default: PgPubsub } = require("@graphile/pg-pubsub");

const pluginHook = makePluginHook([PgPubsub]);

const postgraphileOptions = {
  pluginHook,
  subscriptions: true,
  simpleSubscriptions: true,
  websocketMiddlewares: [
    // Add whatever middlewares you need here, note that they should only
    // manipulate properties on req/res, they must not sent response data. e.g.:
    //
    //   require('express-session')(),
    //   require('passport').initialize(),
    //   require('passport').session(),
  ],
};

const app = express();
app.use(postgraphile(databaseUrl, "app_public", postgraphileOptions));
app.listen(parseInt(process.env.PORT, 10) || 3000);
```

#### Using

Simple subscriptions exposes a `listen` field to the `Subscription` type that
can be used for generic subscriptions to a named topic. This topic can be
triggered using PostgreSQL's built in LISTEN/NOTIFY functionality (but remember
to add the prefix - see below).

```graphql
type ListenPayload {
  query: Query
  relatedNode: Node
  relatedNodeId: ID
}

type Subscription {
  listen(topic: String!): ListenPayload!
}
```

PostGraphile's built in GraphiQL now supports subscriptions, so you can use it
directly to test your application.

#### Topic prefix

**Note**: _this section only applies to "simple subscriptions."_

All topics requested from GraphQL are automatically prefixed with
`postgraphile:`\* to avoid leaking other topics your application may be using

- GraphQL consumers will not need to know about this, but you will need to
  remember to add it to the topic when you perform `NOTIFY` otherwise
  subscribers will not see the messages.

\* _This is applied by default, but you can override it via
`pgSubscriptionPrefix` setting in the `graphileBuildOptions` object; e.g.
`postgraphile(DATABASE_URL, SCHEMAS, {pluginHook, subscriptions: true, graphileBuildOptions: { pgSubscriptionPrefix: "MyPrefix:"}})`.
Note further that this setting only applies to simple subscriptions, custom
subscriptions have no automatic prefix._

For example a user may perform the following subscription:

```graphql
subscription {
  listen(topic: "hello") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Foo {
        id
        title
      }
    }
  }
}
```

To cause the subscription to receive a message, you could run the following in
PostgreSQL:

```sql
select pg_notify(
  'postgraphile:hello',
  '{}'
);
```

Resulting in this GraphQL payload:

```json
{
  "data": {
    "listen": {
      "relatedNodeId": null,
      "relatedNode": null
      }
    }
  }
}
```

Which is sufficient to know that the event _occurred_. Chances are that you want
to know more than this...

It's also possible to send a `Node` along with your GraphQL payload using the
`__node__` field on the `pg_notify` body (which is interpreted as JSON). The
`__node__` field is similar to the `nodeId` (or `id` if you use `--classic-ids`)
field in your GraphQL requests, except it's the raw JSON before it gets
stringified and base64 encoded. (The reason for this is that Postgres' JSON
functions leave some optional spaces in, so when they are base64 encoded the
strings do not match.)

Assuming that you have a table of the form
`foos(id serial primary key, title text, ...)` you can add the `__node__` field
as follows and the record with id=32 will be made available as the `relatedNode`
in the GraphQL subscription payload:

```sql
select pg_notify(
  'postgraphile:hello',
  json_build_object(
    '__node__', json_build_array(
      'foos', -- IMPORTANT: this is not always exactly the table name; base64
              -- decode an existing nodeId to see what it should be.
      32      -- The primary key (for multiple keys, list them all).
    )
  )::text
);
```

Resulting in this GraphQL payload:

```json
{
  "data": {
    "listen": {
      "relatedNodeId": "WyJmb29zIiwzMl0=",
      "relatedNode": {
        "nodeId": "WyJmb29zIiwzMl0=",
        "id": 32,
        "title": "Howdy!"
      }
    }
  }
}
```

> **NOTE**: This solution is still taking shape, so it's not yet certain how
> other fields on the NOTIFY message JSON will be exposed via GraphQL. You are
> advised to treat the content of this message JSON as if it's visible to the
> user, as at some point it may be.

> **NOTE**: In PostgreSQL the channel is an "identifier" which by default is
> limited to 63 characters. Subtracting the `postgraphile:` prefix leaves 50
> characters for your topic name.

#### Subscription security

**Note**: _this section only applies to "simple subscriptions."_

By default, any user may subscribe to any topic, whether logged in or not, and
they will remain subscribed until they close the connection themselves. This can
cause a number of security issues; so we give you a method to implement security
around subscriptions.

By specifying `--subscription-authorization-function [fn]` on the PostGraphile
CLI (or using the `subscriptionAuthorizationFunction` option) you can have
PostGraphile call the function you specified to ensure that the user is allowed
to subscribe to the relevant topic. The function must accept one text argument
`topic` and must return a string or raise an exception (note: the `topic`
argument WILL be sent including the `postgraphile:` prefix).

A typical implementation will look like this:

```sql
CREATE FUNCTION
  app_hidden.validate_subscription(topic text)
RETURNS TEXT AS $$
BEGIN
  IF ... THEN
    RETURN ...::text;
  ELSE
    RAISE EXCEPTION 'Subscription denied'
      USING errcode = '.....';
  END IF;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;
```

You must define this function with your custom security logic. To use this
function you'd pass the CLI flag:
`--subscription-authorization-function app_private.validate_subscription`

The text value returned is used to tell the system when to cancel the
subscription - if you don't need this functionality then you may return a
_static_ unique value, e.g. generate a random UUID (manually) and then return
this same UUID over and over from your function, e.g.:

```sql
CREATE FUNCTION app_hidden.validate_subscription(topic text)
RETURNS TEXT AS $$
BEGIN
  IF ... THEN
    RETURN '4A2D27CD-7E67-4585-9AD8-50AF17D98E0B'::text;
  ELSE
    RAISE EXCEPTION 'Subscription denied' USING errcode = '.....';
  END IF;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;
```

When a message is published to the topic identified by the return value of this
function (NOTE: this topic will NOT be prefixed with `postgraphile:` because it
should be private), the associated subscription will automatically be
terminated.

#### Naming your topics

**Note**: _this section only applies to "simple subscriptions."_

You might want to make the topic a combination of things, for example the
subject type and identifier - e.g. 'channel:123'. If you do this then your
function could determine which subject the user is attempting to subscribe to,
check the user has access to that subject, and finally return a PostgreSQL topic
that will be published to in the event the user is kicked from the channel, e.g.
`'channel:123:kick:987'` (assuming '987' is the id of the current user).

#### Example walk-through

**Note**: _this section only applies to "simple subscriptions."_

First, set up a `.postgraphilerc.js` containing the following:

```js
module.exports = {
  options: {
    plugins: ["@graphile/pg-pubsub"],
    connection: "postgres:///subs",
    schema: ["app_public"],
    simpleSubscriptions: true,
  },
};
```

Next, in terminal 1, run:

```
createdb subs || true
postgraphile
```

In terminal 2, connect to the subs DB using `psql subs` and run the following:

```sql
create schema if not exists app_public;
create schema if not exists app_private;

create table if not exists app_public.foo (
 id serial primary key,
 title text not null
);

create or replace function
  app_private.validate_subscription(topic text)
  returns text as
$$
 select 'CANCEL_ALL_SUBSCRIPTIONS'::text;
$$ language sql stable;
```

Then using a GraphQL client that supports subscriptions, such as
[GraphQL Playground](https://github.com/graphcool/graphql-playground), perform
the following subscription:

```graphql
subscription {
  listen(topic: "hello") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Foo {
        id
        title
      }
    }
  }
}
```

You are not expecting an immediate result; first you have to trigger the event.
To do so, back in your `psql` session in terminal 2, execute:

```sql
insert into app_public.foo (title) values ('Howdy!') returning *;
select pg_notify(
  'postgraphile:hello',
  json_build_object(
    '__node__', json_build_array(
      'foos',
      (select max(id) from app_public.foo)
    )
  )::text
);
```

You should find that the event has been received by the client and the 'Howdy!'
node has come through. You can run the above a few more times, or experiment a
bit by changing the values if you like.

Finally to cancel the subscription, execute the following SQL:

```sql
select pg_notify(
  'CANCEL_ALL_SUBSCRIPTIONS',
  json_build_object()::text
);
```

You should notice that your client is no longer subscribed.

**Bonus**: the SQL commands in this walk-through can be automated with this
handy bash script:

```bash
#!/bin/bash
set -e
createdb subs || true
psql -1X -v ON_ERROR_STOP=1 subs << HERE
create schema if not exists app_public;
create table if not exists app_public.foo (
 id serial primary key,
 title text not null
);
create schema if not exists app_private;
create or replace function app_private.validate_subscription(topic text)
returns text as \$\$
 select 'CANCEL_ALL_SUBSCRIPTIONS'::text;
\$\$ language sql stable;
HERE

sleep 1

psql -1X -v ON_ERROR_STOP=1 subs << HERE
 do \$\$
 declare
   v_foo app_public.foo;
 begin
   insert into app_public.foo (title) values ('Howdy!') returning * into v_foo;
   perform pg_notify(
     'postgraphile:hello',
     json_build_object('__node__', json_build_array('foos', v_foo.id))::text
   );
 end;
 \$\$ language plpgsql;
HERE

sleep 3

psql -1X -v ON_ERROR_STOP=1 subs << HERE
 do \$\$
 declare
   v_foo app_public.foo;
 begin
   insert into app_public.foo (title) values ('Goodbye!') returning * into v_foo;
   perform pg_notify(
     'postgraphile:hello',
     json_build_object('__node__', json_build_array('foos', v_foo.id))::text
   );
   perform pg_notify(
     'CANCEL_ALL_SUBSCRIPTIONS',
     json_build_object()::text
   );
 end;
 \$\$ language plpgsql;
HERE
```

### Advanced setup

If you need websockets to be listened for before your first HTTP request comes
in (most people don't need this) then you must create a `rawHTTPServer`, mount
your express `app` in it, and then add subscription support to the raw server
via the `enhanceHttpServerWithSubscriptions` function, as shown below:

```js
const {
  postgraphile,
  makePluginHook,
  enhanceHttpServerWithSubscriptions,
} = require("postgraphile");
const { default: PgPubsub } = require("@graphile/pg-pubsub");
const { createServer } = require("http");
const express = require("express");

const pluginHook = makePluginHook([PgPubsub]);

const app = express();
const rawHTTPServer = createServer(app);

const postgraphileOptions = {
  pluginHook,
  simpleSubscriptions: true,
  websocketMiddlewares: [
    // Add whatever middlewares you need here, note that
    // they should only manipulate properties on req/res,
    // they must not sent response data. e.g.:
    //
    //   require('express-session')(),
    //   require('passport').initialize(),
    //   require('passport').session(),
  ],
};

const postgraphileMiddleware = postgraphile(
  databaseUrl,
  "app_public",
  postgraphileOptions,
);

app.use(postgraphileMiddleware);

enhanceHttpServerWithSubscriptions(rawHTTPServer, postgraphileMiddleware);

rawHTTPServer.listen(parseInt(process.env.PORT, 10) || 3000);
```

The `enhanceHttpServerWithSubscriptions` takes two arguments:

1.  the raw HTTP server from `require('http').createServer()`
2.  the postgraphile middleware (this should be the _same_ middleware that you
    mount into your Express app)
