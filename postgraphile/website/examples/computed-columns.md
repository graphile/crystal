---
sidebar_position: 8
---

# Computed columns

Below, you'll find the result of running various GraphQL queries against the
[examples repo schema](https://github.com/graphile/examples/tree/master/db).
This is intended to be an introduction and quick reference, for full information
please use the documentation links.

Please be aware that these examples use the
[@graphile-contrib/pg-simplify-inflector](https://github.com/graphile-contrib/pg-simplify-inflector)
plugin to simplify the field names over the defaults.

## Topic summary

```graphql
{
  topic(id: 2) {
    body
    bodySummary
  }
}
```

Generated with SQL like this:

```sql
create function app_public.topics_body_summary(
  t app_public.topics,
  max_length int = 30
)
returns text
language sql stable
as $$
  select case
    when length(t.body) > max_length
    then left(t.body, max_length - 3)
           || '...'
    else t.body
    end;
$$;
```

Result:

```json
{
  "topic": {
    "body": "PostGraphile is a powerful, idomatic, and elegant tool.",
    "bodySummary": "PostGraphile is a powerful,..."
  }
}
```

## Topic summary with argument

```graphql
{
  topic(id: 2) {
    body
    bodySummary(maxLength: 20)
  }
}
```

Generated with SQL like this:

```sql
create function app_public.topics_body_summary(
  t app_public.topics,
  max_length int = 30
)
returns text
language sql stable
as $$
  select case
    when length(t.body) > max_length
    then left(t.body, max_length - 3)
           || '...'
    else t.body
    end;
$$;
```

Result:

```json
{
  "topic": {
    "body": "PostGraphile is a powerful, idomatic, and elegant tool.",
    "bodySummary": "PostGraphile is a..."
  }
}
```
