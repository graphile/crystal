# Production Considerations

## Overview

Gra*fast* works best with [static queries](#static-queries), which is most
likely what you will be using already (unless you're using string concatenation
to build up your queries, in which case you should switch to using
[variables](https://graphql.org/learn/queries/#variables)).

Assuming you're consuming your GraphQL schema via an HTTP API, we recommend
that you use [persisted operations](#persisted-operations) (e.g. via
[`@grafserv/persisted`](https://www.npmjs.com/package/@grafserv/persisted)) to
act as an operation "allow list." This helps to protect your server against bad
actors sending malicious queries trying to instigate a [Denial of
Service](#denial-of-service) attack.

If you choose not to use persisted operations, or if you want to be extra safe
(especially if your team are not extremely disciplined about adding pagination
limits or careful about placement of variables), then you should also consider
setting planning and execution timeouts:

```js
const preset = {
  grafast: {
    timeouts: {
      /** Planning timeout in ms */
      planning: 500,

      /** Execution timeout in ms */
      execution: 30_000,
    },
  },
};
```

In either case, it may be wise to track bad actors and block/rate limit
requests from them. You can typically do this via a middleware in your
webserver.

Below, we'll go into a little more detail on each of these topics.

## Static queries

Building a GraphQL query via string concatination is generally considered bad
practice (both in Gra*fast* and in the wider GraphQL ecosystem):

```js
function getUserDetails(userId) {
  // DON'T DO THIS
  const source = `
    query UserDetails {
      userById(id: ${userId}) { # <<< STRING CONCATENATION IS BAD!
        username
        avatarUrl
      }
    }
  `;
  return runGraphQLQuery(source);
}
```

Instead, declare the query text once (a "static query"), and then use [GraphQL
variables](https://graphql.org/learn/queries/#variables) to pass parameters
alongside the query text:

```js
// Declare the query once:
const UserDetailsQuery = /* GraphQL */ `
  query UserDetails($userId: Int!) {
    userById(id: $userId) {
      username
      avatarUrl
    }
  }
`;

function getUserDetails(userId) {
  // Run the static query using the dynamic variable:
  return runGraphQLQuery(UserDetailsQuery, { userId });
}
```

Over HTTP this might look like:

```http
POST /graphql HTTP/1.1
Host: example.com
Content-Type: application/json
Accept: application/json

{
  "query": "query UserDetails($userId: Int!) { userById(id: $userId) { username avatarUrl } }",
  "variables": {
    "userId": 7
  }
}
```

In Gra*fast* this is especially important because each time we see a new
GraphQL document we will need to plan it, so by reusing the same document over
and over again we can reduce our planning costs many times over.

## Persisted operations

If you do not intend to allow third parties to run arbitrary operations against
your API then using
[persisted operations](https://github.com/graphile/persisted-operations) as a
query allowlist is a highly recommended solution to protect any GraphQL
endpoint (Gra*fast* or otherwise). This technique ensures that only the
operations you use in your own applications (website, mobile apps, desktop app,
etc) can be executed on the server, preventing malicious (or merely curious)
actors from executing operations which may be more expensive than those you
have written.

This technique is suitable for the vast majority of use cases and supports many
GraphQL clients, but it does have a few caveats:

- Your API will only accept operations that you've approved, so it is not
  suitable if you want third parties to run arbitrary custom operations.
- You must be able to generate a unique ID (e.g. a hash) from each operation at
  build time of your application/web page - you must use [static
  queries](#static-queries). It's important to note this only applies to the
  operation document itself, the variables can of course change at runtime.
- You must have a way of sharing these static operations from the application
  build process to the server so that the server will know what operation the ID
  represents.
- You should be careful not to use variables in dangerous places within your
  operation; for example if you were to use `allPosts(first: $myVar)` a
  malicious attacker could set `$myVar` to `2147483647` to cause your server to
  process as much data as possible. Use fixed limits, conditions and orders
  where possible, even if it means having additional static operations
  (alternatively, have you schema enforce the presence and/or valid ranges for
  these).
- Persisted operations do not protect you from writing expensive queries
  yourself; it may be wise to combine this technique with a cost estimation
  technique to help guide your developers and avoid accidentally writing
  expensive queries.

Grafserv has first-party support for persisted operations via the open
source
[`@grafserv/persisted`](https://www.npmjs.com/package/@grafserv/persisted)
module; we recommend its use to the vast majority of our users. If you're using
an Envelop-powered server, check out
[`@envelop/persisted-operations`](https://www.npmjs.com/package/@envelop/persisted-operations).

## Denial of Service

**TL;DR**: Use [persisted operations](#persisted-operations), or configure
[timeouts](#timeouts).

Gra*fast*, like all technologies, makes tradeoffs. Gra*fast*'s main trade-off
is that it does work the first time it sees a GraphQL operation ("planning") in
order to significantly reduce the amount of work that operation will need each
time it runs (even with different variables/context/etc). Sometimes this
planning pays off on that same request, but often it might take another request
or two to recoup the planning cost via the efficiency gains (after which it's
all pure gains!)

Since planning is synchronous JavaScript code, and Node.js is single-threaded,
this planning will hold up the event loop for a short period whilst it
completes. For simple operations this might only be fractions of a millisecond,
but it can grow for larger and more complex requests, especially if you are
utilising step classes that have complex `deduplicate`, `optimize` or `finalize`
methods. It's not uncommon for planning of larger queries, especially those
involving polymorphism, to take 50+ms to plan.

An adversary might attempt to exploit this planning time to instigate a Denial
of Service attack, so it's essential that we do not allow adversaries to have
our servers plan excessively complex queries. There are two main approaches to
this:

1. Use an "allow list" of approved queries - see [Persisted operations](#persisted-operations)
2. Place limits on requests - see [Limits](#limits)

You can use one or, preferably, both of these techniques to protect your server.

## Limits

There are many ways of placing limits on the requests that your server accepts.
Generally you want to catch bad actors without interfering with legitimate
users, so you're looking for anomalies - usage outside the norms - and you want
to rate-limit or block these.

On top of this, you want to ensure that any one request cannot take more than a
certain threshold of time/resources, and this is where timeouts come in.

### Rate-limiting / blocking

Your webserver is generally best placed to decide whether or not to execute a
request.

A simple protection is to require authentication to use your API. This is not
suitable for all APIs, but if it works for you it could significantly decrease
your attack surface - particularly protecting you from untargeted automated
attacks. Another approach to protect against untargeted attacks is to check
the origin of requests, or to require the inclusion of a randomly generated
value such as a CSRF token.

Each version of an application (website, mobile app, etc) is likely to have a
small-ish number of static queries (a few hundred, perhaps). Users of GraphiQL
or similar IDEs are unlikely to send your server more than, say, 50 new unique
queries in any five minute period. One option is to configure your server to
count the unique queries coming from a particular source over a particular
period, and block future queries from that source once the limit has been met.

Similarly you might track how long each request is taking to execute, and give
each client a maximum execution time per time window - once this time has been
exceeded you could block future requests from this client until their window
refreshes.

Most of this is standard fare for web servers, and you should be able to find
modules in your server ecosystem to help you address them.

### Timeouts

Once you've started executing a GraphQL operation, you probably shouldn't let
it run forever. Gra*fast* gives you two options for configuring timeouts: a
`planning` timeout that applies when an operation is being planned, and an
`execution` timeout that applies each time a plan is executed. Timeouts are
configured in the `preset`, which is the second (and optional) argument that
you pass to `grafast()` or `execute()` (or is the configuration file you use
for `grafserv`).

```js
const preset = {
  grafast: {
    timeouts: {
      /** Planning timeout in ms */
      planning: 500,

      /** Execution timeout in ms */
      execution: 30_000,
    },
  },
};
```

#### Planning timeout

The planning timeout applies each time an operation is planned.

Planning can be time consuming, and especially so when the server has just
started and V8 hasn't had a chance to warm up the JIT caches yet. Therefore, we
increase the allowed timeout for the first few operations planned.

The planning timeout is only checked at certain stages whilst planning the
query, so it can be exceeded (generally only by a few tens of
milliseconds). Should you find this problematic, please get in touch and we can
discuss adding timeout checks in more locations.

Most importantly, note that the planning time required for an operation will
vary depending on the load on your machine, how powerful it is, and what has
been planned previously. We recommend setting a high limit such as 500ms and
combining this with the rate limiting described in the section above.

#### Execution timeout

The execution timeout applies each time an operation plan is executed.

When an operation is first seen, it will undergo planning (adhering to the
planning timeout) and then execution (adhering to the execution timeout) - the
execution timeout _does not_ include the planning.

The execution timeout is only checked just before an asynchronous step (a
normal step - one that doesn't have `step.isSyncAndSafe === true`) is about to
be executed - it is assumed that synchronous steps are fast enough that a
timeout need not be applied to them. Note that this means that steps themselves
are responsible for adhering to the timeout - they will be passed a `stopTime`
property on the "extra" argument to `execute()`, and when the value of
`performance.now()` is greater than or equal to `stopTime` they should abort
their active operation.
