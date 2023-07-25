---
layout: page
path: /postgraphile/subscriptions/
title: GraphQL Subscriptions
---

Subscriptions notify you when an event occurs on the server side. PostGraphile
supports subscriptions out of the box (assuming you are using it with a
supported webserver), but you are responsible for adding subscription fields to
your schema.

## Websockets

The most common transport for GraphQL subscriptions is via Websockets. To
enable or disable websocket support in your API, use the
`preset.grafserv.websockets` option:

```js title="graphile.config.mjs"
export default {
  //...
  grafserv: {
    websockets: true,
  },
};
```

:::info

The endpoint for subscriptions is the same as for GraphQL, except the protocol
is changed from `http` or `https` to `ws` or `wss` respectively.

:::

## Adding subscription fields

The easiest way to add subscription fields is by using
[`makeExtendSchemaPlugin`](./make-extend-schema-plugin) to extend the
`Subscription` type and add your field. Your subscription fields will typically
leverage the Gra*fast*
[`listen()`](https://grafast.org/grafast/step-library/standard-steps/listen)
step to subscribe to events on a pubsub-capable entity.

### subscribePlan() and plan()

Unlike the rest of your schema where you typically use the `plan()` plan
resolver, for subscriptions we need two plan resolvers: `subscribePlan()` which
will return a streamable step (essentially wrapping an async iterable), and
`plan()` which will take the payload of each of the events from this stream and
convert them into something that the subscription result type can use.

### pgSubscriber

By default (if your PostgreSQL adaptor supports it), PostGraphile will add a
`pgSubscriber` entry to your GraphQL context. This object is pubsub-capable and
uses Postgres' `LISTEN`/`NOTIFY` functionality, which is probably the easiest
way to get started. You can build a step that represents it in your
`subscribePlan()` resolver via:

```ts
const $pgSubscriber = context().get("pgSubscriber");
```

:::tip

You can use any pubsub-capable provider with PostGraphile or Gra*fast*: redis,
MQTT, EventEmitter, etc; all you need is an abstraction that conforms to the
expected interface. See the [`listen()`
documentation](https://grafast.org/grafast/step-library/standard-steps/listen)
for specifics.

:::

### Subscription topic

You will also need a topic to listen on. PostgreSQL topics are limited to 63
characters. This topic can be anything you like within PostgreSQL's
constraints, but it's typically useful to include the primary key of the entity
you're subscribing to in it. In the example below we'll use
`forum:FORUM_ID:message` as the topic for when a new message is posted to a
forum, substituting `FORUM_ID` for the id of the forum that we're interested in
(whether this is an int or a UUID it shouldn't go over the 63 character limit).

### Example

The following is an example pulling it all together. In this example when a new
message is created an event will be sent to `forum:FORUM_ID:message` containing
the payload `{"op": "create", "id": MESSAGE_ID}`. This event will be picked up
by the `pgSubscriber`, which `listen()` subscribes to. This event will then be
parsed by `listen()` using the `jsonParse` method, and the resulting object
will be passed to the `Subscription.forumMessage.plan()` plan resolver, which
does no further processing. The data then flows down to the
ForumMessageSubscriptionPayload field steps, which will extract the details
that they care about and use them to provide the relevant data to the user.

```ts
import { makeExtendSchemaPlugin } from "postgraphile/utils";
import { context, lambda, listen } from "postgraphile/grafast";
import { jsonParse } from "postgraphile/@dataplan/json";

const MySubscriptionPlugin = makeExtendSchemaPlugin((build) => {
  const { messages } = build.input.pgRegistry.pgResources;
  return {
    typeDefs: /* GraphQL */ `
      extend type Subscription {
        forumMessage(forumId: Int!): ForumMessageSubscriptionPayload
      }

      type ForumMessageSubscriptionPayload {
        operationType: String
        message: Message
      }
    `,
    plans: {
      Subscription: {
        forumMessage: {
          subscribePlan(_$root, args) {
            const $pgSubscriber = context().get("pgSubscriber");
            const $forumId = args.get("forumId");
            const $topic = lambda($forumId, (id) => `forum:${id}:message`);
            return listen($pgSubscriber, $topic, jsonParse);
          },
          plan($event) {
            return $event;
          },
        },
      },
      ForumMessageSubscriptionPayload: {
        operationType($event) {
          const $op = $event.get("op");
          return lambda($op, (op) => String(op).toLowerCase());
        },
        message($event) {
          const $id = $event.get("id");
          return messages.get({ id: $id });
        },
      },
    },
  };
});
```

## Triggering subscriptions from database events

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

Hooking the database up to a GraphQL subscription can be achieved via `CREATE
TRIGGER`:

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

#### Testing your subscription with Ruru

To test your subscription you will need to first subscribe and then trigger it.

To subscribe, in one Ruru tab execute

```graphql
subscription MySubscription {
  currentUserUpdated {
    user
    event
  }
}
```

You should get the answer: `"Waiting for subscription to yield data…"`

To trigger the subscription, _in another Ruru tab_ run a mutation that
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
