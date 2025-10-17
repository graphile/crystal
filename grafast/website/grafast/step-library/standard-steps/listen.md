# listen

Subscribes to the given `pubsubOrPlan` to get realtime updates on a given topic
(`topicOrPlan`). The optional third argument is a `ListenOptions` object that
controls how the events are mapped into steps.

Usage:

```ts
const $pubsub = context().get("pubsub");
const $eventStream = listen($pubsub, "my_event", {
  itemPlan: ($item) => doSomethingWith($item),
});
```

The options object supports:

- `itemPlan` — customise how each event is converted into a step. Defaults to
  the identity function so omitting it yields the raw payload.
- `$initialEvent` — optional step to emit before the subscription yields the
  first event. This is useful when the client should receive an initial state at
  subscribe time.

For example, to emit an initial event:

```ts
const $initialEvent = context().get("initialEvent");
const $eventStream = listen($pubsub, "my_event", { $initialEvent });
```

:::warning

The previous signature `listen(pubsubOrPlan, topicOrPlan, itemPlan?,
$initialEvent?)` is deprecated and will be removed in a future release. Use the
`ListenOptions` object instead.

:::
