---
sidebar_position: 5
---

# Mutations

Below, you'll find the result of running various GraphQL queries against the
[examples repo schema](https://github.com/graphile/examples/tree/master/db).
This is intended to be an introduction and quick reference, for full information
please use the documentation links.

Please be aware that these examples use the
[@graphile-contrib/pg-simplify-inflector](https://github.com/graphile-contrib/pg-simplify-inflector)
plugin to simplify the field names over the defaults.

## Create

```graphql
mutation {
  createTopic(
    input: {
      topic: {
        forumId: 2
        title: "My question relates to mutations..."
        body: "How do you write them?"
      }
    }
  ) {
    topic {
      nodeId
      id
      forumId
      title
      body
    }
  }
}
```

```json
{
  "createTopic": {
    "topic": {
      "nodeId": "WyJ0b3BpY3MiLDVd",
      "id": 5,
      "forumId": 2,
      "title": "My question relates to mutations...",
      "body": "How do you write them?"
    }
  }
}
```

## Update

```graphql
mutation {
  updateTopic(input: { id: 1, patch: { title: "My (edited) title" } }) {
    topic {
      nodeId
      id
      title
      body
    }
  }
}
```

Works for a table like:

```sql
create table app_public.topics (
  id serial primary key,
  forum_id integer NOT NULL references app_public.forums on delete cascade,
  title text NOT NULL,
  body text DEFAULT ''::text NOT NULL
);
```

Result:

```json
{
  "updateTopic": {
    "topic": {
      "nodeId": "WyJ0b3BpY3MiLDFd",
      "id": 1,
      "title": "My (edited) title",
      "body": "500-1500 requests per second on a single server is pretty awesome."
    }
  }
}
```

## Delete

```graphql
mutation {
  deleteTopic(input: { id: 1 }) {
    deletedTopicNodeId
  }
}
```

```json
{
  "deleteTopic": {
    "deletedTopicNodeId": "WyJ0b3BpY3MiLDFd"
  }
}
```
