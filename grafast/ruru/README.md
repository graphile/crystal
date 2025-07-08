# ruru

A [Gra*fast*][grafast]-enhanced distribution of [Graph*i*QL][graphiql].

**PRERELEASE**: this is pre-release software; use at your own risk and do not
embed into public-facing projects. This will likely change a lot before it's
ultimately released. The pre-release nature also explains the shocking lack of
documentation.

## Usage - Instant!

If you have Node installed, you can instantly run `ruru` without permanently
installing it using the `npx` command. Here's an example command to explore
[@trevorblades](https://twitter.com/trevorblades)'s countries API:

```
npx ruru -SPe https://countries.trevorblades.com/graphql
```

(`-S` enables subscriptions, `-P` proxies GraphQL requests; neither of these are
needed for Trevor's API, but you might want them for your API.)

## Usage - CLI

Install Ruru:

```
yarn add ruru
```

Then you can run something like the following to automatically proxy requests
(bypassing CORS issues):

```
yarn ruru -SPe http://localhost:5678/graphql
```

Usage:

```
ruru

Run a Ruru server

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

## Usage - server

You can render Ruru from your own server, you should serve both the Ruru HTML
and the static files (JS, CSS, etc) that Ruru needs. We bundle everything you
need, and hooking it up should be relatively straightforward.

### Example: express

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

### Example: node

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

### `config`

No matter which server you're using you'll need a Ruru config object which
should contain at least the following:

- `staticPath`: the URL path on your server from which static assets should be
  served - this must start and end with a slash
- `endpoint`: where to find the GraphQL endpoint - an absolute URL starting
  either with `/` for same-domain, or `http://` / `https://`.

### `ruruHTML(config)`

```ts
import { ruruHTML } from "ruru/server";

const html = ruruHTML(config);
```

This function will return you the HTML to render to the user when they request
the Ruru endpoint; serve it as HTML as you normally would. Use it at whatever
URL you wish to render Ruru.

### `serveStatic(staticPath)`

```ts
import { serveStatic } from "ruru/static";

const staticMiddleware = serveStatic(config.staticPath);
```

This will return a middleware compatible with Node, Express, Connect and similar
servers to serve the static files that Ruru depends on. You must pass it the
same `staticPath` that you passed to `ruruHTML(config)`.

### `getStaticFile(context)`

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
- `disallowSourceMaps` (optional) - set to `true` to forbid sending source maps
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

## Usage - bundle

```html
<!-- optionally import Prettier for query formatting -->
<script src="https://unpkg.com/prettier@1.13.0/standalone.js"></script>
<script src="https://unpkg.com/prettier@1.13.0/parser-graphql.js"></script>
<!-- Required below here -->
<div id="ruru-root"></div>
<script type="module">
  import merm from "https://cdn.jsdelivr.net/npm/mermaid@11.6.0/+esm";
  window.mermaid = merm;
</script>
<script type="module">
  const RURU_STATIC = "https://unpkg.com/ruru/static/";
  // Setup Monaco Editor workers
  const worker = (file) =>
    new Worker(new URL(RURU_STATIC + file), { type: "module" });
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
  const tree = React.createElement(Ruru, {
    endpoint: "/graphql",
  });
  const container = document.getElementById("ruru-root");
  const root = createRoot(container);
  root.render(tree);
</script>
```

## Why "ruru"?

Jem and I are big fans of the late Terry Pratchett's Discworld universe. The
city at the centre of many a Discworld tale is the twin-city city-state of
Ankh-Morpork. A "morepork" is a type of New Zealand owl, known in Māori as
"ruru." Owls have excellent sight, and Ruru helps you to get an insight into not
just the inputs and outputs of your API, but also what it does internally.

RURU is also an abbreviation for checks to use when gathering information: "is
it Reliable, Up-to-date, Relevant, and Useful?" We hope that you'll find Ruru to
be all those things!

<details>
<summary>And this last reason is a little ru-rude...</summary>

... in the Quechua languages, the term "ruru" may refer to, among other things,
"testicle." So when your GraphQL operation isn't doing what you expect and
you're thinking to yourself "this is b\*ll\*cks," then you'll know this is a job
for Ruru!

</details>

[GNU Terry Pratchett](http://www.gnuterrypratchett.com/)

[graphiql]: https://github.com/graphql/graphiql
[grafast]: https://grafast.org
