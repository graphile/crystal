# pgSingleTablePolymorphic

This step class gives just one of many ways of supporting polymorphism in
`@dataplan/pg`; we recommend that you read the [polymorphism](./polymorphism)
documentation before deciding whether or not you need this step - most likely
it is better to use the `mode: "single"` polymorphism setting on the underlying
codec instead.

`pgSingleTablePolymorphic` is a very simple way of representing a polymorphic
type where all of the underlying values are stored in the same table. For
example you might have an `animals` table that stores details of all of your
cats, dogs and fish; such as:

```sql
create table animals (
  id serial primary key,
  type text not null,
  name text not null,
  date_of_birth date not null,
  number_of_lives boolean,
  wags_tail boolean,
  freshwater boolean
);
```

In GraphQL we might represent this as an `Animal` interface, with
implementations `Cat`, `Dog` and `Fish`.

You call `pgSingleTablePolymorphic($typeName, $row)` passing a step indicating
the GraphQL type name, and a step representing the row from the table; for
example:

```ts
const $animal = animalsResource.get({ id: constant(1) });

// 'Cat', 'Dog' or 'Fish'; use a lambda step to transform the values if
// necessary.
const $typeName = $animal.get("type");

return pgSingleTablePolymorphic($typeName, $animal);
```
