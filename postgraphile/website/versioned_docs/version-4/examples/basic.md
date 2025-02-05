---
sidebar_position: 2
---

# Basic

Below, you'll find the result of running various GraphQL queries against the
[examples repo schema](https://github.com/graphile/examples/tree/master/db).
This is intended to be an introduction and quick reference, for full information
please use the documentation links.

Please be aware that these examples use the
[@graphile-contrib/pg-simplify-inflector](https://github.com/graphile-contrib/pg-simplify-inflector)
plugin to simplify the field names over the defaults.

## Forums

```graphql
{
  forums {
    nodes {
      nodeId
      id
      slug
      name
      description
    }
  }
}
```

```json
{
  "forums": {
    "nodes": [
      {
        "nodeId": "WyJmb3J1bXMiLDFd",
        "id": 1,
        "slug": "testimonials",
        "name": "Testimonials",
        "description": "How do you rate PostGraphile?"
      },
      {
        "nodeId": "WyJmb3J1bXMiLDJd",
        "id": 2,
        "slug": "feedback",
        "name": "Feedback",
        "description": "How are you finding PostGraphile?"
      },
      {
        "nodeId": "WyJmb3J1bXMiLDNd",
        "id": 3,
        "slug": "cat-life",
        "name": "Cat Life",
        "description": "A forum all about cats and how fluffy they are and how they completely ignore their owners unless there is food. Or yarn."
      },
      {
        "nodeId": "WyJmb3J1bXMiLDRd",
        "id": 4,
        "slug": "cat-help",
        "name": "Cat Help",
        "description": "A forum to seek advice if your cat is becoming troublesome."
      }
    ]
  }
}
```

## Forum by slug

```graphql
{
  forumBySlug(slug: "testimonials") {
    nodeId
    id
    slug
    name
    description
  }
}
```

```json
{
  "forumBySlug": {
    "nodeId": "WyJmb3J1bXMiLDFd",
    "id": 1,
    "slug": "testimonials",
    "name": "Testimonials",
    "description": "How do you rate PostGraphile?"
  }
}
```
