---
title: PostGraphile Realtime
---

Every application is different, and no more so than when it comes to their
realtime requirements. Some applications are read-heavy, others write-heavy, and
others are collaborative and need to put in effort to avoid conflicts between
multiple people editing the same things at the same time (e.g. Google Docs).

PostGraphile focusses on customisability and extensibility; rather than giving a
one-size-fits-all solution, we provide the baseline subscription
functionality in core, and the rest is achieved by adding and combining
plugins - the official ones, ones made by the community, or ones you've
developed in-house. This enables you to use whatever technology best suits your
requirements to provide the realtime features to PostGraphile.

<!--

First, though, there are two main types of real-time provided by PostGraphile —
"subscriptions" (which are event based) and "live queries" (which are reactive).

-->

### Subscriptions

"Subscriptions" are a way of having a new message proactively sent to the client
automatically whenever a particular event occurs on the server side, such as:

```js
subscription {
  chatMessageAdded(channel: 27) {
    id
    message
    author { id name avatarUrl }
    timestamp
  }
}
```

This example subscription would result in a new response whenever a new message
is added to channel `27`. Note that a normal subscription such as this one only
triggers when the event occurs (i.e. chat message added) - it does not trigger
when the message is edited, or if the author changes their avatar.

Subscriptions are part of the latest GraphQL specification, and are well
supported by many clients.

Use subscriptions when:

- You need to update your UI based on events happening in the system
- You know which events should trigger an update
- Performance and scalability is important to you

[Find out more about subscriptions in PostGraphile](./subscriptions).

<!--

### Live queries [EXPERIMENTAL]

"Live queries" allow you to be notified whenever the result of a selection set
would differ. For example, given the PostGraphile live query request:

```graphql
subscription {
  allUsersList(condition: { firstName: "Alice" }) {
    id
    name
    friendsList {
      id
      name
    }
  }
}
```

a new result set will be automatically sent to the client time any of the
returned Alices change, when an Alice is added or removed, when an Alice gains
or loses a friend, or when one of the Alice's friends' names change - anything
that'd result in a change to the original response.

Live queries are not part of the GraphQL specification (yet) and each backend
implements them in different ways. We use the `subscription` operation type to
maximise compatibility with your existing tooling, rather than using a
directive-based approach. Your client will not know the difference between a
subscription and a live query - that's the server's concern.

When to use live queries:

- If you want to automatically update your page whenever a piece of data on the
  server changes (e.g. a realtime graph of stock prices)
- When you want to batching multiple updates together, for example if your
  client is being overwhelmed due to too many events firing
- When you have a small query you want to monitor (the smaller the query the
  better for live queries because the entire result is re-calculated and sent
  every time a change occurs - this is quite the opposite of normal GraphQL)
- When you want to fawn over the power of GraphQL 🤤

[Find out more about live queries in PostGraphile](./live-queries).

-->
