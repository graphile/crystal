---
sidebar_position: 3
---

# Collections

Below, you'll find the result of running various GraphQL queries against the
[examples repo schema](https://github.com/graphile/examples/tree/master/db).
This is intended to be an introduction and quick reference, for full information
please use the documentation links.

Please be aware that these examples use the
[@graphile-contrib/pg-simplify-inflector](https://github.com/graphile-contrib/pg-simplify-inflector)
plugin to simplify the field names over the defaults.

## First offset

```graphql
{
  forums(first: 1, offset: 1) {
    nodes {
      nodeId
      id
      name
    }
  }
}
```

```json
{
  "forums": {
    "nodes": [
      {
        "nodeId": "WyJmb3J1bXMiLDJd",
        "id": 2,
        "name": "Feedback"
      }
    ]
  }
}
```

## Relation condition

```graphql
{
  forumBySlug(slug: "testimonials") {
    nodeId
    id
    name
    topics(condition: { authorId: 2 }) {
      nodes {
        nodeId
        id
        title
        body
      }
    }
  }
}
```

```json
{
  "forumBySlug": {
    "nodeId": "WyJmb3J1bXMiLDFd",
    "id": 1,
    "name": "Testimonials",
    "topics": {
      "nodes": [
        {
          "nodeId": "WyJ0b3BpY3MiLDFd",
          "id": 1,
          "title": "Thank you!",
          "body": "500-1500 requests per second on a single server is pretty awesome."
        }
      ]
    }
  }
}
```
