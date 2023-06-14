# pgPolymorphic

This step class gives just one of many ways of supporting polymorphism in
`@dataplan/pg`; we recommend that you read the [polymorphism](./polymorphism)
documentation before deciding whether or not you need this step, since it is
one of the more verbose options! It's likely that a simpler approach may suit
you.

pgPolymorphic works by taking a record step (a `pgSelectSingle`), a specifier
step (an arbitrary step) and a entity type map. The entity type map keys are
the GraphQL type names that are possible, and for each of these the value is an
object with the following properties:

- `match` - a function that is passed the specifier data and returns true if
  it's a match for this type
- `plan` - a function that is passed the specifier _step_ of a _matching_
  specifier and the original record step, and should return a step representing
  the record identified by this specifier.

## Example

Imagine we have a database in which you can favourite records from three
different tables: "people", "posts" and "comments".

These favourites are stored in a single "favourites" table, which among other
attributes (such as the id of the user doing the favouriting) has three
attributes to indicate which entity was favourited: `liked_person_id`,
`liked_post_id`, `liked_comment_id`. These three attributes implement the "one
of" pattern - exactly one of these three attributes will be set, the others
being null.

We want to retrieve the entity that you have favourited, based on the step
`$favourite` which represents the row in the "favourites" table.

Using the above knowledge, we can build a specifier step, `$specifier`, that
contains all the data necessary to determine the polymorphic record we wish to
retrieve by representing the three "one of" ids as a tuple (or list).

```ts
const $specifier = list([
  $favourite.get("liked_person_id"),
  $favourite.get("liked_post_id"),
  $favourite.get("liked_comment_id"),
]);
```

We prepare our `personFavouriteEntityTypeMap` matcher based around this specifier,
it looks at the tuple and determines:

- if the first entry in the tuple, the one associated with `liked_person_id`,
  is not null then the record must represent a `Person`, and we can get the
  related person from `personResource` where `person_id` is equal to this first
  entry in the tuple
- otherwise, if the second entry is not null then the record must represent a `Post`, and we can
  get that post from `postResource` in a similar way
- otherwise, if the third entry is not null then the record must represent a `Comment`, and we can
  get that comment in a similar way

```ts
const personFavouriteEntityTypeMap = {
  Person: {
    match: (specifier) => specifier[0] != null,
    plan: ($specifier) => personResource.get({ person_id: $specifier.at(0) }),
  },
  Post: {
    match: (specifier) => specifier[1] != null,
    plan: ($specifier) => postResource.get({ post_id: $specifier.at(1) }),
  },
  Comment: {
    match: (specifier) => specifier[2] != null,
    plan: ($specifier) => commentResource.get({ comment_id: $specifier.at(2) }),
  },
};
```

Finally we pass our record step (`$favourite`), our specifier step
(`$specifier`) and our matcher (`personFavouriteEntityTypeMap`) to
`pgPolymorphic` and it will know how to retrieve the associated record - the
person, post or comment:

```ts
return pgPolymorphic($favourite, $specifier, personFavouriteEntityTypeMap);
```
