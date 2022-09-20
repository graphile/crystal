# groupBy

Takes a single dimensional list step and a mapper that returns a grouping key.
Returns a step that results in a Map where the keys are the grouping keys and
the values are lists of the original entries that match these grouping keys.

Usage:

```ts
const $groupedByAuthorId = groupBy($posts, ($post) => $post.get("author_id"));
```
