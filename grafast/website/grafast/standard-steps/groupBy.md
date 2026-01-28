# groupBy

Takes a single-dimensional list step and a (plan-time) mapper that yields a
grouping key. Returns a step that yields a Map where the keys are the grouping
keys and the values are lists of the original entries that match these grouping
keys.

Usage:

```ts
// Runtime input: Post[]
// Runtime output: Record<ID, Post[]>
const $groupedByAuthorId = groupBy($posts, ($post) => $post.get("author_id"));
```
