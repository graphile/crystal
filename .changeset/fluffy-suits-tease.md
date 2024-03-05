---
"graphile-build-pg": patch
"postgraphile": patch
"grafast": patch
---

Breaking: `connection()` step now accepts configuration object in place of 2nd
argument onwards:

```diff
-return connection($list, nodePlan, cursorPlan);
+return connection($list, { nodePlan, cursorPlan });
```

Feature: `edgeDataPlan` can be specified as part of this configuration object,
allowing you to associate edge data with your connection edges:

```ts
return connection($list, {
  edgeDataPlan($item) {
    return object({ item: $item, otherThing: $otherThing });
  },
});

// ...

const plans = {
  FooEdge: {
    otherThing($edge) {
      return $edge.data().get("otherThing");
    },
  },
};
```

Feature: `ConnectionStep` and `EdgeStep` gain `get()` methods, so
`*Connection.edges`, `*Connection.nodes`, `*Connection.pageInfo`, `*Edge.node`
and `*Edge.cursor` no longer need plans to be defined.
