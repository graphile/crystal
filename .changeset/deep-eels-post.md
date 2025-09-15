---
"graphile-build-pg": patch
"@dataplan/pg": patch
---

Add ability for Postgres client to capture `RAISE NOTIFY` issued during an SQL
query. An example follows:

Database:

```sql
create table foo (id serial primary key, bar text);
create function tg_foo() returns trigger language plpgsql volatile as $$
begin
  raise notice 'Hello World' using hint = 'Hi, ' || NEW.bar;
  return NEW;
end;
$$;
create trigger _insert before insert on foo for each row execute function tg_foo();
```

Plugin:

```ts
const plugin = extendSchema({
  typeDefs: /* GraphQL */ `
    type PgNotice {
      severity: String
      message: String
      code: String
      detail: String
      hint: String
    }
    extend type CreateFooPayload {
      messages: [PgNotice]
    }
  `,
  plans: {
    CreateFooPayload: {
      messages($payload: any) {
        const $result = get($payload, "result") as PgInsertSingleStep;
        return $result.getNotices();
      },
    },
  },
});
```

Result:

```json
{
  "data": {
    "createFoo": {
      "clientMutationId": null,
      "foo": {
        "id": "WyJmb29zIiwzXQ==",
        "bar": "inputvalue"
      },
      "messages": [
        {
          "severity": "NOTICE",
          "message": "Hello World",
          "code": "00000",
          "detail": null,
          "hint": "Hi, inputvalue"
        }
      ]
    }
  }
}
```
