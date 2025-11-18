# listen

Subscribes to the given `pubsubOrPlan` to get realtime updates on a given topic
(`topicOrPlan`), mapping the resulting event via the `itemPlan` callback.

## Example

```ts
const $pubsub = context().get("pubsub");
const $eventStream = listen($pubsub, "my_event", ($item) =>
  doSomethingWith($item),
);
```
