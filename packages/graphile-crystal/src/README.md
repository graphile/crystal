# Crystal

Crystal is Graphile Engine v5's lookahead engine. It takes the lessons learned
from Graphile Engine v4 and completely rebuilds the lookahead engine with the
following goals in mind:

- Increased performance
- Easier to understand
- Easier to write lookahead code
- Easier to debug
- More flexible

## FutureValue

A `FutureValue` represents an abstract set of similarly structured POJOs, e.g.:

```json
[
  { "id": 1, "text": "hello" },
  { "id": 2, "text": "good day" },
  { "id": 3, "text": "greetings" }
]
```

This set is abstract because the same `FutureValue` instance may be used with
multiple input sets, one for each plan execution, so the FutureValue is more of
a pub/sub, receiving a set of resolved values and distributing these to the
interested plans/other futures.

<!-- Every FutureValue has an `.eval(cb)` function which will call the callback when
a set of values is available; but  -->

You can use `futureValue.transform(cb)` to return a new transformed FutureValue;
for example to turn a set of database records into a set of stripe customers, or
a set of stripe customers into a set of booleans determining whether or not each
user has an active plan.

You can use `FutureValue.zip([fv1, fv2, ...])` to "zip together" multiple future
values; e.g.

```js
// The start value represents the parameters at the root of the query; e.g. for
// `Query.userById(id: 27)` it would represent `[{id: 27}]`; for
// `User.stripeCustomer` it would represent `[{stripe_customer_id:
// "sdfsdfsdfsdf"}, {stripe_customer_id: "asdasdasd"}, ...]` (the set would be
// as large as there are users).
//
// In this case, this is an empty FutureValue representing an array of empty
// objects because our "allForums" field's resolver will only be called once;
// given this field is only called once the array will contain only one empty
// object
const $startValue = new EntrypointFutureValue();

// The root of our plan; our allForums field fetches N forums for each call:
const forumsPlan = forumLoader.fetchMany($startValue); // Array<Forum[]>

// Crystal notices that the return type of allForums is a list, so it creates a
// future representing the individual records. There will be N records (despite
// there being only 1 forum).
const $forum = forumsPlan.listEntry();

// Now we're planning the messagesConnection field. We're not going to actually
// execute this up front; instead dependent fields (such as nodes, edges) may
// use a clone of it which will be executed.
//
// Note that each of the following futures has the same size, so they can later
// be zipped back together.
const $forumId = $forum.get("id"); // Array<{id: number}>
const $forumSecret = forumSecretsLoader.fetchByForumId($forumId); // Array<ForumSecret>
const $stripeId = $forumSecret.get("stripe_id"); // Array<{stripe_id: string}>
const $stripeCustomer = stripeLoader.fetchCustomerById($stripeId); // Array<{customer: StripeCustomer }>
const $hasActivePlan = $stripeCustomer.transform((customer) => ({
  hasActivePlan: !!customer.subscriptions.find(isActive),
})); // Array<{hasActivePlan: boolean}>
// Now we've checked the availability of plans for each forum, we will use that
// to influence the messages we retrieve for said forum.
const $forumAndHasPlan = FutureValue.zip([$forumId, $hasActivePlan]); // Array<{id: number, hasActivePlan: boolean}>
const $messages = messagesLoader.fetchMany(
  $forumAndHasPlan,
  (plan) =>
    sql.fragment`${plan.alias}.forum_id = ${plan.values}.id and ${plan.values}."hasActivePlan" is true`,
); // Array<Message[]>
```

Some FutureValues have other ways of referencing the batch of values. For
example:

- An SQL-compatible FutureValue would have a `.toSQL()` method that would return
  a `pg-sql2` fragment, e.g. `select id, text from greetings`.

- A GraphQL-compatible FutureValue would have a `.toGraphQLSelectionSet()`
  method which might return a fragment such as `... on Greeting { id text }`.

FutureValues inherently have a "selection" (the list of fields they're
interested in), and allow transformations to a smaller selection set via the
`.get(keys)` method. This returns a new FutureValue representing this smaller
selection, e.g. for the FutureValue above, `fv.get(["id"])` would return a
FutureValue representing:

```json
[{ "id": 1 }, { "id": 2 }, { "id": 3 }]
```

For this more narrow FutureValue, `.toSQL` would return
`select id from greetings` and `.toGraphQLSelectionSet()` would return
`... on Greeting { id }`

For a FutureValue, `.keys()` returns the current selection.

Once a plan is established, all FutureValues within it are `.finalize()`-d, at
which point no further `.eval()` callbacks can be added, and no more `.get()`
derivatives can be generated (because those derivatives depend on the parent).

## Glossary

The following query may be referenced in the glossary

```graphql
{
  allUsers {
    id
    name
    friends(first: 5, condition: { nearby: true }) {
      id
      name
    }
  }
}
```

- `PathIdentity` is the unique path through this document describing this
  specific field using only concrete types; in the case of `friends` it would be
  something like `Query.allUsers>User.friends`
- `children` are the fields referenced in a child selection set, e.g. for the
  `friends` field the `children` would be `id` and `name`
- `parent` refers to the field the containing selection set is applied to, e.g.
  for the `friends` field, the `parent` would be `allUsers`
- `counterparts` refers to, during resolution, the other instances of a field's
  resolver at this `PathIdentity` within the document, e.g. for the `friends`
  field it would be all the instances of the `friends` resolver, one for each
  user returned from `allUsers`.
- `Doc` represents a GraphQL document within a specific instance of the schema;
  this allows for optimizations when the same document is used multiple times
  (as in the case of static queries). It's highly recommended that you use a
  GraphQL server that caches query parse results (such as PostGraphile) so you
  can leverage this optimization.
- `Aether` refers to the context within which resolvers run; generally you can
  think of this as a single call to `graphql(...)` but calls to `graphql(...)`
  that share the same schema, document, rootValue, context and variables may
  result in the same Aether.
- `Batch` represents a grouped execution of related fields and their plans;
  there may be one Batch for the entire document, or multiple batches within the
  document. Each field can belong to at most one batch during runtime.
- `BatchRoot` is the `PathIdentity` at the root of a particular Batch
  (incidentally the smallest PathIdentity within the batch). Where the entire
  GraphQL document is executed in one batch this may be the empty string.
  Directives such as `@stream` and `@defer` may define their own batch roots.
- `CrystalResult` contains the final data and more contextual information; it
  can be used to generate the result from the relevant resolver.
