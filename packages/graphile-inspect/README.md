# graphile-inspect

Graphile-flavoured GraphiQL.

## Usage - bundle

```html
<div id="graphile-inspect-root"></div>
<link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
<script
  crossorigin
  src="https://unpkg.com/graphile-inspect/bundle/graphile-inspect.min.js"
></script>
<script>
  const { React, ReactDOM, GraphileInspect } = GraphileInspectBundle;
  const tree = React.createElement(GraphileInspect, {
    target: "/graphql",
  });
  const root = document.getElementById("graphile-inspect-root");
  ReactDOM.render(tree, root);
</script>
```

## Usage - library

```js
import { GraphileInspect } from "graphile-inspect";

React.render(<GraphileInspect target="/graphql" />);
```
