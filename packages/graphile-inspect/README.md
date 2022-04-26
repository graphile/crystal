# graphile-inspect

Graphile-flavoured GraphiQL.

## Usage - bundle

```html
<!-- optionally import Prettier for query formatting -->
<script src="https://unpkg.com/prettier@1.13.0/standalone.js"></script>
<script src="https://unpkg.com/prettier@1.13.0/parser-graphql.js"></script>
<!-- Required below here -->
<div id="graphile-inspect-root"></div>
<link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
<script
  crossorigin
  src="https://unpkg.com/graphile-inspect/bundle/graphile-inspect.min.js"
></script>
<script>
  const { React, createRoot, GraphileInspect } = GraphileInspectBundle;
  const tree = React.createElement(GraphileInspect, {
    target: "/graphql",
  });
  const container = document.getElementById("graphile-inspect-root");
  const root = createRoot(container);
  root.render(tree);
</script>
```

## Usage - library

```js
import { GraphileInspect } from "graphile-inspect";

React.render(<GraphileInspect target="/graphql" />);
```

## Usage - middleware

```js
import { graphileInspectHTML } from "graphile-inspect/server";

// ...

app.get("/", (req, res, next) => {
  res.writeHead(200, { "Content-Type": "application/html" });
  return res.end(
    graphileInspectHTML({
      endpoint: "/graphql",
    }),
  );
});
```
