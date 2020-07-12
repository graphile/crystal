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

A `FutureValue` represents a set of values with associated identifiers. The
identifiers allow grouping the values back up into the expected form, since a
single FutureValue may be shared across hundreds or thousands of field
executions (e.g. the field `User.friends` may be called hundreds of times in a
single GraphQL execution, this would be represented by a single FutureValue, but
in the resolver we need to determine which of the resulting "friends" was
actually for us).

Thus the type of a FutureValue is an array of tuples, where the first value in
the tuple is the identifiers (strings, numbers, booleans, etc) and the second
value in the tuple is the actual resulting value.

Crystal uses the "dependencies" of a field (including the dependencies of any
arguments) to determine the identifiers. These are uniqued, and then the
resulting order is locked so that an array of values (rather than an object) may
be used for identification.

A future value representing `Query.allGreetings` might be something like:

```json
[
  [
    [], // identifiers
    [
      { "id": 1, "text": "hello" },
      { "id": 2, "text": "good day" },
      { "id": 3, "text": "greetings" }
    ] // The "value" (since this is a list field, an array is expected)
  ]
]
```

Above we see that the identifiers (the first entry in the tuple) are all empty,
this is common with root-level fields which have no identifiers.

A field deeper in the tree, such as `User.friends`, likely would have
identifiers. In the case of `User.friends` the identifiers are likely the
`User`'s `id`:

```json
[
  [
    [7], // identifiers
    [
      { "user_id": 7, "friend_id": 29 },
      { "user_id": 7, "friend_id": 36 }
    ] // The "value"
  ],
  [
    [8], // identifiers
    [
      { "user_id": 8, "friend_id": 36 },
      { "user_id": 8, "friend_id": 42 }
    ] // value
  ]
]
```

This set is **abstract** because the same `FutureValue` instance may be used
with multiple input sets, one for each plan execution, so the FutureValue is
more of a pub/sub, receiving a set of resolved values and distributing these to
the interested plans/other futures.

<!-- Every FutureValue has an `.eval(cb)` function which will call the callback when
a set of values is available; but  -->

You can use `futureValue.transform(cb)` to return a new transformed FutureValue;
for example to turn a set of database records into a set of stripe customers, or
a set of stripe customers into a set of booleans determining whether or not each
user has an active plan. Transforms preserve the identifiers, so they're a
little like `mapValues` on an object.

You can use `FutureValue.zip([fv1, fv2, ...])` to "zip together" multiple future
values that use the same identifiers. This would require "materialization" of
the future values, reducing the effectiveness of batching operations, so it
should be used sparingly.

## OUTDATED SECTION - needs review.

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

## Start value

We all have to start somewhere. The start value represents the parameters at the
root of the query; e.g. for `Query.userById(id: 27)` it would probably
represent:

```json
[[[], { "id": 27 }]]
```

For `User.stripeCustomer` it might represent

```json
[
  [["stripe_1"], { "stripe_customer_id": "stripe_1" }],
  [["stripe_2"], { "stripe_customer_id": "stripe_2" }]
]
```

Note that although there may be 200 users, if there's only 2 stripe customers
between them (and even if multiple users share the same stripe customer), the
set above still only contains two values, and despite that it contains
everything we need to look up the result within the resolvers (all users
referencing the same stripe customer would just return the same stripe
customer - that's totally allowed).

A Start Value is modelled as a future.

### Walk-through example

We're going to walk through executing:

```graphql
{
  allForums {
    messagesConnection {
      nodes {
        id
      }
    }
  }
}
```

`Query.allForums` returns `[Forum!]!` straight from the DB.

`Forum.messageConnection` returns a relay connection `MessagesConnection!`;
importantly however there's a filter applied to messageConnection that requires
us to talk to a third party, Stripe, to determine if the forum's plan is
currently active. This is a contrived example.

`MessagesConnection.nodes` returns `[Message!]!` by executing a cloned version
of the internal plan from `Forum.messageConnection`.

In this example, our start value is an empty FutureValue representing an array
of empty objects because our "allForums" field's resolver will only be called
once; given this field is only called once the array will contain only one empty
object.

```ts
type IdentifierValue<TIdentifierTuple extends [], TValue = any> = [
  TIdentifierTuple,
  TValue,
];
type FutureSet<TIdentifierTuple extends [], TValue = any> = Array<
  IdentifierValue<TIdentifierTuple, TValue>
>;
const $$start = new EntrypointFutureValue(); // FutureSet<[],{}>
```

For a more complex example, such as `User.stripeCustomer`, the type would
reflect the "dependencies" of the field and might be something like:
`FutureSet<[/*user_id*/ number], {user_id: number}>`, or, if the
stripe_customer_id could be determined ahead of time, maybe
`FutureSet<[/*stripe_customer_id*/ string], {stripe_customer_id: string}>` or
even
`FutureSet<[/*user_id*/ number, /*stripe_customer_id*/ string], {user_id: number, stripe_customer_id: string}>`.

#### Plan: 'Query.allForums'

Crystal determines that the `allForums` field needs to be called, so calls its
plan function which looks something like this:

```js
function Query_allForums_plan($$id) {
  const forumsPlan = forumLoader.fetchMany($$id);
  return forumsPlan;
}

const forumsPlan = Query_allForums_plan($$start);
```

##### Dependencies

Crystal now scans for all the dependencies relevant to this plan:

- `Forum.messageConnection` declares dependencies `["id"]`
- no further dependencies found.

Crystal uniques this list to produce `["id"]`, and then tells the plan it must
fetch these dependencies:

```js
//------------------------------------------------------------------------------
//!DEPENDENCIES: `Forum.messagesConnection`

forumsPlan.dependencies(["id"]);
```

##### Result plan

Now Crystal has ensured that the plan fetches everything it needs to, it can
build a future value to represent what the field should return:

```js
const $forums = forumsPlan.future(); // FutureSet<[], Array<Forum>>
```

The next layer of plans, however, would run on a per-forum basis (GraphQL will
loop through the list for us). We need a way of representing an individual Forum
rather than the entire list...

#### Plan: Forum.messageConnection

Here Crystal uses the "dependencies" for the messageConnection again, to get an
identifier for the calls into this field that can be used to unpack the results
later. Note we pass "1" here as a consistency check, as we must go through 1
layer of nested lists. If the parent plan returned a singular record we'd use
`.get(...)` instead of `.each()`. If the parent plan returned a list of lists,
we'd pass a "2" here.

```js
const $$id = $forums.each(["id"], 1); // FutureSet<[/*forum_id*/ number], {"id": number}>
```

Note the two tuples in the comment above are identical: they both contain the
value of "id" for the record. The later tuple will have derivatives generated
during the plan, but the first tuple must remain fixed so that we can re-group
the results later.

This `$$id` identifier behavior is similar to how the "batch loading function"
in a DataLoader typically works. A DataLoader must return results in the same
order as the requested inputs; this is normally achieved inside the batch
loading function: the function fetches all the records from the data source and
then maps over the inputs, finding the relevant record(s) for each input.
Crystal handles this matching for us using the identifier.

Now we must call the user's plan using this identifier.

Note that because this is a connection we're building a plan here we're not
going to actually execute up front; instead dependent fields (such as nodes,
edges) may use a clone of it which will be executed. We still have to return a
plan, so we return a special "connection" plan that contains all this logic.

Note further that each of the subplans we're creating here share the same
identifiers, so they can later be 'zipped' back together.

```js
function Forum_messageConnection_plan($$id) {
  const forumSecretPlan = forumSecretsLoader.fetchByForumId($$id);
  forumSecretPlan.dependencies(["stripe_customer_id"]);

  const $forumSecret = forumSecretPlan.future(); // FutureSet<[/*forum_id*/ number], {stripe_customer_id: string, ...}>
  // TODO: should getting the non-list version result in a non-list result?
  const $stripeId = $forumSecret.get(["stripe_customer_id"]); // FutureSet<[/*forum_id*/ number], [/*stripe_customer_id*/ string]>

  const stripeCustomerPlan = stripeLoader.fetchCustomerById($stripeId);
  const $stripeCustomer = stripeCustomerPlan.future(); // FutureSet<[/*forum_id*/ number], StripeCustomer>

  const $hasActivePlan = $stripeCustomer.transform((customer) => ({
    hasActivePlan: !!customer.subscriptions.find(isActive),
  })); // FutureSet<[/*forum_id*/ number], {hasActivePlan: boolean}>

  // Now we've checked the availability of plans for each forum, we will use that
  // to influence the messages we retrieve for said forum. const
  // TODO: should we convert this into named properties via some get/alias shenanigans?
  const $forumAndHasPlan = FutureValue.zip([$$id, $hasActivePlan]); // FutureSet<[/*forum_id*/ number], {id: number, hasActivePlan: boolean}>
  const messagesPlan = messagesLoader.fetchMany(
    $forumAndHasPlan,
    (plan) =>
      sql.fragment`${plan.alias}.forum_id = ${plan.values}.id and ${plan.values}."hasActivePlan" is true`,
  );
  return connectionPlan(messagesPlan);
}

const connectionPlan = Forum_messageConnection_plan($$id);
```

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
