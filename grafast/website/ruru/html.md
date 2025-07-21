# HTML

A simple static HTML file that loads dependencies from
https://unpkg.com/ruru/static/ so you don't need to serve them yourself.

## Hosted

`https://grafast.org/myruru/#endpoint=http://...`

Visit the above URL, replacing the `http://...` at the end with your desired
GraphQL endpoint. Said endpoint must be set up to allow CORS requests to the
endpoint.

Great way to try it out without having to install anything!

Try it out:

https://grafast.org/myruru/#endpoint=https://countries.trevorblades.com/graphql

## Self-hosted

Have your own GraphQL API at `https://example.com/path/to/graphql`?

Simply:

1. download [`ruru.html`](https://unpkg.com/ruru/ruru.html)
2. update the `"endpoint": "/graphql"` line to point to your endpoint
   (`"endpoint": "/path/to/graphql"` for this example)
3. Delete the code between `DELETE THIS` and `/DELETE THIS`
4. Serve the resulting file at `https://example.com/ruru.html`

Now anyone who visits `https://example.com/ruru.html` can use Ruru to explore
and query your API!

:::note[GraphQL endpoint should be on the same origin server]

If your endpoint is on a different server to that which you serve `ruru.html`,
you will need to address CORS issues.

:::

## Embedded

You can also embed Ruru into your own HTML files with this element and script
tag:

```html
<div id="ruru-root"></div>
<script type="module">
  // Change this to the path to your GraphQL endpoint
  const endpoint = "/graphql";
  const RURU_STATIC = "https://unpkg.com/ruru/static/";

  // Ensure monaco workers are set up before loading Ruru
  const worker = (file) => {
    // Works around an issue with cross-origin worker scripts
    const blob = new Blob([`import "${RURU_STATIC}${file}";`], {
      type: "application/javascript",
    });
    const url = URL.createObject(blob);
    return new Worker(url, { type: "module" });
  };
  globalThis.MonacoEnvironment = {
    getWorker(_workerId, label) {
      switch (label) {
        case "json":
          return worker("jsonWorker.js");
        case "graphql":
          return worker("graphqlWorker.js");
        default:
          return worker("editorWorker.js");
      }
    },
  };

  // Load Ruru
  const { React, createRoot, Ruru } = await import(RURU_STATIC + "ruru.js");

  // Render
  const tree = React.createElement(Ruru, { endpoint });
  const container = document.getElementById("ruru-root");
  const root = createRoot(container);
  root.render(tree);
</script>
```
