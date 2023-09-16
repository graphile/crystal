---
sidebar_position: 4
---

# Relations

Below, you'll find the result of running various GraphQL queries against the
[examples repo schema](https://github.com/graphile/examples/tree/master/db).
This is intended to be an introduction and quick reference, for full information
please use the documentation links.

Please be aware that these examples use the
[@graphile-contrib/pg-simplify-inflector](https://github.com/graphile-contrib/pg-simplify-inflector)
plugin to simplify the field names over the defaults.

## Forums topics posts

```graphql
{
  forumBySlug(slug: "cat-life") {
    name
    topics(first: 1, orderBy: [CREATED_AT_ASC]) {
      nodes {
        id
        title
        bodySummary
        author {
          id
          username
        }
        posts(first: 1, orderBy: [ID_DESC]) {
          nodes {
            id
            author {
              id
              username
            }
            body
          }
        }
      }
    }
  }
}
```

```json
{
  "forumBySlug": {
    "name": "Cat Life",
    "topics": {
      "nodes": [
        {
          "id": 4,
          "title": "I love cats!",
          "bodySummary": "They're the best!",
          "author": {
            "id": 1,
            "username": "user"
          },
          "posts": {
            "nodes": [
              {
                "id": 6,
                "author": {
                  "id": 3,
                  "username": "Bradley_A"
                },
                "body": "I love it when they completely ignore you until they want something. So much better than dogs am I rite?"
              }
            ]
          }
        }
      ]
    }
  }
}
```
