---
title: Procedures
---

PostgreSQL 11 introduced `CREATE PROCEDURE`, invoked via `call proc(...)`
rather than being embedded in a `select` like a function. PostGraphile exposes
these procedures as GraphQL mutation fields.

Since a procedure can only be invoked with `call`, not `select`, it can't be
used as a computed column, a custom query, or return a connection. It's
always a root-level mutation field, similar to a [custom
mutation](./custom-mutations) function.

```sql
create procedure app_public.raise_widget_price(widget_id int, out new_price numeric)
language plpgsql as $$
begin
  update app_public.widgets
  set price = price * 1.1
  where id = widget_id
  returning price into new_price;
end;
$$;
```

This procedure would be exposed as a `raiseWidgetPrice` mutation field; since
it has an `OUT` parameter, the payload includes a `result` field (renamed
according to the parameter's name in some configurations) containing the
procedure's output:

```graphql
mutation {
  raiseWidgetPrice(input: { widgetId: 1 }) {
    result {
      newPrice
    }
  }
}
```

Procedures with no `OUT`/`INOUT` parameters expose no result field (comparable
to a function that `returns void`). Procedures with `INOUT` parameters accept
the parameter as input _and_ include it on the result, since the same
parameter serves both roles.

PostGraphile also has solid support for functions, which are more flexible;
see [Functions](./functions) for more details.

## Limitations

- Procedures can't be used as computed columns, custom queries, or return
  connections. They're always mutations.
- `SETOF`/`RETURNS TABLE` aren't available for procedures in PostgreSQL, so
  neither is supported here.
- Variadic parameters aren't currently supported (same restriction as
  functions).
