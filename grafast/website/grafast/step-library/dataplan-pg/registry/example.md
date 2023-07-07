---
sidebar_position: 5
---

# Full registry example

A registry for a simple schema using two tables 'forums' and 'messages' might
be look something like the following; please refer to the codec, resource
(including executor) and relation documentation for details on the specifics.

Remember: you can auto-generate this.

```ts
import { sql } from "pg-sql2";
import { context, object } from "grafast";
import {
  PgExecutor,
  TYPES,
  makePgResourceOptions,
  makeRegistry,
  makeRegistryBuilder,
  recordCodec,
} from "@dataplan/pg";

// The executor is responsible for talking to the database. If you have
// multiple databases, you will have multiple executors (one per database).
const executor = new PgExecutor({
  name: "default",
  context() {
    return object({ withPgClient: context().get("withPgClient") });
  },
});

// Represents the type of the 'forums' table:
const forumsCodec = recordCodec({
  name: "forums",
  identifier: sql`forums`,
  attributes: {
    id: {
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
    },
    name: {
      codec: TYPES.citext,
      notNull: true,
    },
  },
});

// Represents the 'forums' table, including knowledge of its primary key:
const forumsResourceOptions = makePgResourceOptions({
  name: "forums",
  executor,
  codec: forumsCodec,
  from: sql`forums`,
  uniques: [{ attributes: ["id"], isPrimary: true }],
});

// Represents the type of the 'messages' table:
const messagesCodec = recordCodec({
  name: "messages",
  identifier: sql`messages`,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
      hasDefault: true,
    },
    forum_id: {
      codec: TYPES.int,
      notNull: true,
    },
    message: {
      codec: TYPES.text,
      notNull: true,
    },
  },
});

// Represents the 'messages' table:
const messagesResourceOptions = makePgResourceOptions({
  name: "messages",
  executor,
  codec: messagesCodec,
  from: sql`messages`,
  uniques: [{ isPrimary: true, attributes: ["id"] }],
});

// The builder tracks all the types so you end up with a strongly-typed registry
const builder = makeRegistryBuilder()
  // First add our codecs
  .addCodec(forumsCodec)
  .addCodec(messagesCodec)

  // Then add our resources
  .addResource(forumsResourceOptions)
  .addResource(messagesResourceOptions)

  // A message relates to a single forum:
  .addRelation(messagesCodec, "forum", forumsResourceOptions, {
    localAttributes: ["forum_id"],
    remoteAttributes: ["id"],
    isUnique: true,
  })

  // A forum can have many messaegs:
  .addRelation(forumsCodec, "messages", messagesResourceOptions, {
    localAttributes: ["id"],
    remoteAttributes: ["forum_id"],
    // The foreign key reference is defined on 'messages', so we're the one
    // that's referenced by a foreign key
    isReferencee: true,
  });

// Finally build the registry:
const registry = makeRegistry(builder.getRegistryConfig());
```

## Example schema

Given the above registry, you might create a schema with plans something like this:

```ts
const { forums, messages } = registry.pgResources;

const typeDefs = /* GraphQL */ `
  type Query {
    forumById(id: Int!): Forum
  }

  type Forum {
    id: Int!
    name: String!
    messages: [Message!]!
  }

  type Message {
    id: Int!
    message: String!
    forum: Forum!
  }
`;

const plans = {
  Query: {
    forumById(_, { $id }) {
      return forums.get({ id: $id });
    },
  },
  Forum: {
    messages($forum) {
      return messages.find({ forum_id: $forum.get("id") });
      // OR: return $forum.manyRelation("messages");
    },
  },
  Message: {
    forum($message) {
      return forums.get({ id: $message.get("forum_id") });
      // OR: return $message.singleRelation("forum");
    },
  },
};

import { makeGrafastSchema } from "grafast";
const schema = makeGrafastSchema({ typeDefs, plans });
```

:::note

Although this simple ORM-like appearance looks like it would trigger multiple
SQL statements, in most cases Grafast and `@dataplan/pg` working in concert
will result in the plan being analyzed and the requests being automatically
combined via joins and/or subqueries to produce a highly efficient SQL query

:::

(TODO: test this works.)
