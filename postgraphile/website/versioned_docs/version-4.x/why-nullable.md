---
layout: page
path: /postgraphile/why-nullable/
title: Why is it nullable?
---

It's common for people, particularly those using strongly typed GraphQL
implementations such as ReasonML or TypeScript, to ask why certain elements in a
PostGraphile schema are nullable. A lot of thought has gone into which parts
should/should not be nullable, but the reasoning behind these decisions is not
always obvious to users, so hopefully this article will help to explain.

### Nulls in GraphQL

In GraphQL, nulls cascade up the tree until they find the first "nullable". So
take for example this GraphQL Schema:

```graphql
# This is a bad practice GraphQL schema to demonstrate a point.

type Numbers {
  one: Int!
  two: Int!
  three: Int!
}

type Letters {
  a: String!
  b: String!
  c: String!
}

type Query {
  numbers: Numbers!
  letters: Letters!
}
```

and this query:

```graphql
{
  numbers {
    one
    two
    three
  }
  letters {
    a
    b
    c
  }
}
```

If there was an issue causing the resolver for `Numbers.three` to throw an
error, then GraphQL would first try and make the field itself null. It can't,
because it's not nullable, so it would then try and make the parent field
(`numbers`) null. But that's marked as non-nullable too, so the only thing left
to make nullable would be the entire query itself. This means that all the
letters, despite producing no errors, would also be omitted from the result.

One of the key aims of GraphQL is to deal smoothly with temporary errors - i.e.
when an error occurs it aims to not
["throw the baby out with the bathwater"](https://en.wikipedia.org/wiki/Don%27t_throw_the_baby_out_with_the_bathwater).
This is one of the reasons (the main reason, really) that GraphQL treats all
fields as nullable by default ("errors happen") and allows you to mark things as
not null, rather than the other way around which is more common in typed
languages. GraphQL wants you to think about where errors may occur and where
they should be limited to, preventing them from flowing over into unrelated
areas.

### Root (Query, Mutation and Subscription) fields

If you're following GraphQL best practices, then all of your root level Query,
Mutation and Subscription fields should be nullable unless you're absolutely
certain that they cannot throw an error or be null, and further that none of
their children or grandchildren or great-grandchildren can throw an error or
return a null that would cascade and cause the field itself to be null.

In PostGraphile, two of our `Query` fields are not nullable because they adhere
to this check:

- `nodeId` returns a set value (the string 'query') so it can never error
- `query` returns the `Query` object again (it's a Relay 1 hack) and so it has
  all the same guarantees as the Query object

Everything else is nullable, because **errors happen** and we don't want them to
cascade to sibling fields.

To make this even clearer: if our mutation fields were "not nullable" and you
performed a mutation such as this:

```graphql
mutation {
  createSecret(input: {label: "Foo"}) { secret }
  someOtherMutation(input: {...}) { ... }
}
```

If mutations were marked non-nullable and yet for some reason
`someOtherMutation` threw an error, then the entire GraphQL response would come
back null and you wouldn't see the result of the `createSecret` mutation. As per
the GraphQL spec: mutations are independent, thus the `createSecret` mutation
would not be rolled back and the value would be created but never shown.

### Relations: RLS visibility

PostgreSQL uses foreign keys to assert that relations exist. Take this SQL
schema:

```sql
create table person (
  id serial primary key,
  username citext not null
);

create table post (
  id serial primary key,
  author_id int not null references person on delete cascade,
  body text not null
);
```

From this we know that given a `Post` record exists, then the associated
`Person` object must also exist - PostgreSQL guarantees this. So why does
PostGraphile mark the `Post.personByAuthorId` field as nullable? Well, consider
this:

```sql
-- Users can only see their own 'Person'
create policy select_self on person for select using (id = current_user_id());
-- Users can see all Posts
create policy select_all on post for select using (true);
```

Given the above, it's possible for you to be able to see a Post without you
being allowed to see the associated Person. So even though the person definitely
exists, that doesn't guarantee that you can see them.

### Fields under mutation payloads

For similar reasons to the Relations above, it's possible for you to be able to
create something but then not see the result of that - it really depends how
you've defined your security. For example, if you create a truly anonymous
"feedback" item then there's nothing in it to indicate that you're allowed to
view it.

### What about nullable nodes in table connections?

This one at first seems obviously a mistake - of course if I request a list of
rows from a table or function I'm not going to get some rows and some nulls -
they'll either all fail or all succeed... Surely? Well, it turns out: no -
functions which return connections (that is
`CREATE FUNCTION ...(...) RETURNS SETOF table_type AS ...`) can return nulls as
well as table rows. In my opinion, doing so is a bad practice.

If you can commit to never returning null rows in your `SETOF` functions, then
you can use the "no SETOF functions contain nulls" flag to change this
behaviour. I recommend this flag; but it's disabled by default to maximise
compatibility (also going from nullable to non-nullable is fine, but going the
other way is a breaking change).

    -N, --no-setof-functions-contain-nulls
    if none of your RETURNS SETOF compound_type functions mix NULLs with the results
    then you may enable this to reduce the nullables in the GraphQL schema

### What about computed fields?

It's very easy for computed fields (functions) to throw an error due to a logic
issue in the function. We don't want that bringing down the entire schema so we
leave these as nullable.

I'd be happy to accept a Pull Request that adds functionality marking a function
as non-nullable via a smart comment (e.g.
`COMMENT ON FUNCTION foo_func(foo) IS E'@notNull';`) - do raise an issue if this
is of interest to you. Even with this, though, it would be unwise to mark
root-level functions as non-nullable - what if the PostgreSQL connection is
terminated when resolving that field, should that make all the other fields null
too? GraphQL best practices suggest that we should keep errors as localised as
we can.

### I've read the above, but I still want this particular thing to be non-nullable!

Sure! PostGraphile is built with extensibility and customisability in mind - you
can fix that with a plugin.

Here's a plugin which looks for all forward relation fields (like
`personByAuthorId`) and changes their definition so that their type is the
GraphQLNonNull-wrapped version of their original type:

```js
module.exports = function NonNullRelationsPlugin(builder) {
  builder.hook("GraphQLObjectType:fields:field", (field, build, context) => {
    if (
      !context.scope.isPgForwardRelationField ||
      !context.scope.pgFieldIntrospection?.keyAttributes?.every(
        (attr) => attr.isNotNull,
      )
    ) {
      return field;
    }
    return {
      ...field,
      type: new build.graphql.GraphQLNonNull(field.type),
    };
  });
};
```

---

If there's other things that are null but you think should not be, please raise
and issue on GitHub and we'll either fix it, or update this document to explain
why it's nullable.
