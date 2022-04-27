# graphile-inspect

Graphile-flavoured GraphiQL.

**PRERELEASE**: this is pre-release software; use at your own risk and do not
embed into public-facing projects. This will likely change a lot before it's
ultimately released. This also explains the shocking lack of documentation.

## Usage - CLI

```
graphile-inspect

Run a Graphile Inspect server

Options:
      --help                   Show help                                                                      [boolean]
      --version                Show version number                                                            [boolean]
  -e, --endpoint               endpoint for query and mutation operations
                                                                    [string] [default: "http://localhost:5678/graphql"]
  -p, --port                   port number to run the server on                                [number] [default: 1337]
  -P, --proxy                  Proxy requests to work around CORS issues                                      [boolean]
  -S, --subscriptions          enable subscriptions, converting --endpoint to a ws:// URL    [boolean] [default: false]
  -s, --subscription-endpoint  endpoint for subscription operations (overrides -S)                             [string]
```

Recommended: something like
`graphile-inspect -SP -e http://localhost:5678/graphql`

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
    endpoint: "/graphql",
  });
  const container = document.getElementById("graphile-inspect-root");
  const root = createRoot(container);
  root.render(tree);
</script>
```

## Usage - library

```js
import { GraphileInspect } from "graphile-inspect";

React.render(<GraphileInspect endpoint="/graphql" />);
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
