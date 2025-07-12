# Server

If your GraphQL API is served from a Node.js server, rendering Ruru alongside it
enables your users to explore and query your API with minimal fuss.

Ruru is unopinionated on servers, giving you two methods that should work with
any server:

- `ruruHTML(...)` - generate the HTML file
- `getStaticFile(...)` - return the buffer and headers for the given static
  file, if it exists

If you're using node, express, or a similar server then you can use the
`serveStatic(...)` middleware to handle the `getStaticFile(...)` calls for you.

:::tip[Serving the static assets is optional]

You only need to serve the HTML (using the `ruruHTML(...)` helper) - the assets
will be served from `unpkg.com` by default.

However it's advised that you do serve the static assets (e.g. using
`serveStatic(...)`) as this allows your development environment to run Ruru even
when there is no internet connection.

:::

## Example: express

```ts
import express from "express";
import { ruruHTML } from "ruru/server";
import { serveStatic } from "ruru/static";

const app = express();

const config = { staticPath: "/ruru-static/", endpoint: "/graphql" };
// Serve Ruru HTML
app.get("/", (req, res) => {
  res.format({
    html: () => res.status(200).send(ruruHTML(config)),
    default: () => res.status(406).send("Not Acceptable"),
  });
});
// Serve static files
app.use(serveStatic(config.staticPath));

// Don't forget to serve your GraphQL endpoint:
//
//   app.post("/graphql", ...);
```

## Example: node

```ts
import { createServer } from "node:http";
import { ruruHTML } from "ruru/server";
import { serveStatic } from "ruru/static";

const config = {
  staticPath: "/ruru-static/",
  endpoint: "https://example.com/graphql", // Your endpoint
};

// Create the static middleware _ONCE ONLY_ for efficiency.
const staticMiddleware = serveStatic(config.staticPath);

// Create your HTTP server
const server = createServer((req, res) => {
  if (req.url === "/") {
    // Serve Ruru HTML
    const html = ruruHTML(config);
    res.writeHead(200, {
      "content-type": "text/html",
      "content-length": html.length,
    });
    res.end(html);
    return;
  } else {
    // Serve static files
    return staticMiddleware(req, res);
  }
});
```

## `config`

No matter which server you're using you'll need a Ruru config object which
should contain at least the following:

- `staticPath`: the URL path on your server from which static assets should be
  served - this must start and end with a slash
- `endpoint`: where to find the GraphQL endpoint - an absolute URL starting
  either with `/` for same-domain, or `http://` / `https://`.

## `ruruHTML(config)`

```ts
import { ruruHTML } from "ruru/server";

const html = ruruHTML(config);
```

This function will return you the HTML to render to the user when they request
the Ruru endpoint; serve it as HTML as you normally would. Use it at whatever
URL you wish to render Ruru.

## `serveStatic(staticPath)`

```ts
import { serveStatic } from "ruru/static";

const staticMiddleware = serveStatic(config.staticPath);
```

This will return a middleware compatible with Node, Express, Connect and similar
servers to serve the static files that Ruru depends on. You must pass it the
same `staticPath` that you passed to `ruruHTML(config)`.

## `getStaticFile(context)`

```ts
import { getStaticFile } from "ruru/static";

const file = await getStaticFile({
  staticPath: config.staticPath,
  urlPath: request.url,
  acceptEncoding: request.headers["accept-encoding"],
});
```

The `serveStatic` middleware works for Express, Connect, Node and some others,
but if you're not using these then we give you a simple function you can use to
serve the required static file from _any_ Node.js based server framework.

Context is an object with the following values:

- `staticPath` - the same `staticPath` as found in `config.staticPath` passed to
  `ruruHTML` above
- `urlPath` - the path the current HTTP request requested (must start with `/`,
  can include query string)
- `acceptEncoding` - the value of the `Accept-Encoding` HTTP header, or
  `undefined` if not set
- `disallowDevAssets` (optional) - set to `true` to forbid sending source maps
  (reduces server memory pressure by about 10MB at the cost of debuggability)

The result is either `null` if the file isn't found, or an object containing:

- `headers` - a headers object to set on the response (Content-Type,
  Content-Length, Content-Encoding, etc)
- `content` - a buffer containing the data to serve

Use your framework to serve this as appropriate:

```ts
// This is an **IMAGINARY** server API, adjust to fit your server.

if (file) {
  // Found!
  const { etag } = file.headers;
  if (request.headers["if-none-match"] === etag) {
    response.status(304).headers({ etag }).send(); // Don't serve; etag matched!
  } else {
    response.status(200).headers(file.headers).send(file.content);
  }
} else {
  response.status(404).send("Not Found");
}
```
