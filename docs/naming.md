# Naming
PostGraphQL is in an interesting position when it comes to naming things. GraphQL requires a lot of names, field names, type names, argument names; and has very little names from PostgreSQL to use to construct the names for GraphQL. In addition by the nature of what PostGraphQL wants to accomplish, often we end up having to name even more things (like relationship fields, that’s where names like `postNodesByAuthorId` come from).

This is an explanation and a guide to how things get named in PostGraphQL.

## Aliasing
Before we go on, there is something very important to mention. PostGraphQL does not expect that your client uses all of the field names PostGraphQL defines (especially some of the longer ones). Luckily GraphQL allows us to alias fields which means if you don’t like how PostGraphQL has named a field, you can just alias the field and refer to it however you’d like in your application. The names PostGraphQL has picked are optimal for the *server*, the names you pick are optimal for your *client*.

Aliasing works like this:

```graphql
{
  allPeople: personNodes {
    people: nodes {
      firstName: givenName
      authoredPosts: postNodesByAuthorId {
        posts: nodes {
          headline
        }
      }
    }
  }
}
```

So instead of selecting the `headline` field in JavaScript like this:

```js
personNodes.nodes[0].postNodesByAuthorId.nodes[0].headline
```

You could insted do this:

```js
allPeople.people[0].authoredPosts.posts[0].headline
```

## Guiding Principles
There are a few guiding principles to follow when naming things in PostGraphQL:

- **Empathy.** Whenever possible, names should make sense for a wide range of languages (not programming languages, actual speaking languages). We do not pluralize or singularize names as it could alienate certain language speakers.
- **Intuitive.** Whatever name we choose should make intuitive sense. While GraphQL does have descriptions to help a users understanding of a field, ideally the name should be explanatory.
- **Conflict free.** Names should generally not conflict with names defined by the user in the database. We don’t want a conflict between say a column name and a name we picked for a relation. This also means names should be specific. If a detail is missing from a name it might conflict with another similar name.
- **Camel case.** GraphQL was born out of the JavaScript community, therefore we camelCase 😉

## Assumptions
When picking names, we assume that all table names are singular. So for instance a table is named `user` instead of `users`. Singular table names are generally considered [best practice][singular-vs-plural] when naming SQL tables anyway. Because of the empathy principle, names should be understandable if the table name is plural, however it is ok to prefer singular.

[singular-vs-plural]: http://stackoverflow.com/a/5841297/1568890

## Exceptions
There is one conflict which we will often run into as we implement the [Relay `Node` specification][relay-node-spec]. In this specification they require a specialized `id` field on any type that implements `Node`. It just so happens that we want all of our table objects to implement `Node` and most of those tables will define their own `id` column. In this case we rename the column `id` to `rowId`.

[relay-node-spec]: http://facebook.github.io/relay/graphql/objectidentification.htm

## Controversial Names
### Why `edges` and `nodes`?
That terminology is originally a part of the [Relay cursor connection specification][relay-cursor-spec] and traditional [graph database lingo][graph-database-structure].

PostGraphQL has adopted this convention (although it does make querying connections wordier) for two reasons:

1. To be in line with Relay.
2. To allow for room on list connections for super useful fields like `pageInfo` and `totalCount`.

You can consider `edges` inside of a field like `personNodes` to be a data envelope in a REST request which allows us to embed some important meta pagination information.

[relay-cursor-spec]: http://facebook.github.io/relay/graphql/connections.htm
[graph-database-structure]: https://en.wikipedia.org/wiki/Graph_database#Structure

### Why `postByAuthorId` instead of `post`?
This is an instance where we are trying to avoid conflicts. A `post` table may have an `author_id` column which references a `person` table, but it may *also* have an `editor_id` column which also references the same `person` table. If we were to name the field `post`, it would be ambiguous between these two references. Instead we opt for `postByAuthorId` so we make ourselves room to also have a `postByEditorId`.
