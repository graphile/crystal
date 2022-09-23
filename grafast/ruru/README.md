# ruru

A [Grafast][grafast]-enhanced distribution of [Graph*i*QL][graphiql].

**PRERELEASE**: this is pre-release software; use at your own risk and do not
embed into public-facing projects. This will likely change a lot before it's
ultimately released. This also explains the shocking lack of documentation.

## Usage - CLI

We recommend that you install this alongside `http-proxy`:

```
yarn add http-proxy @grafast/ruru
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

## Usage - bundle

```html
<!-- optionally import Prettier for query formatting -->
<script src="https://unpkg.com/prettier@1.13.0/standalone.js"></script>
<script src="https://unpkg.com/prettier@1.13.0/parser-graphql.js"></script>
<!-- Required below here -->
<div id="ruru-root"></div>
<link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
<script
  crossorigin
  src="https://unpkg.com/@grafast/ruru/bundle/ruru.min.js"
></script>
<script>
  const { React, createRoot, Ruru } = RuruBundle;
  const tree = React.createElement(Ruru, {
    endpoint: "/graphql",
  });
  const container = document.getElementById("ruru-root");
  const root = createRoot(container);
  root.render(tree);
</script>
```

## Usage - library

```js
import { Ruru } from "@grafast/ruru";

React.render(<Ruru endpoint="/graphql" />);
```

## Usage - middleware

```js
import { ruruHTML } from "@grafast/ruru/server";

// ...

app.get("/", (req, res, next) => {
  res.writeHead(200, { "Content-Type": "application/html" });
  return res.end(
    ruruHTML({
      endpoint: "/graphql",
    }),
  );
});
```

## Why "ruru"?

Jem and I are big fans of the late Terry Pratchett's Discworld universe. The
city at the centre of many a Discworld tale is the twin city city-state of
Ankh-Morpork. A "morepork" is a type of New Zealand owl, known in Māori as
"ruru." Owls have excellent sight, and Ruru helps you to get an insight into not
just the inputs and outputs of your API, but also what it does internally.

RURU is also an abbreviation for checks to use when gathering information - is
it: Reliable, Up-to-date, Relevant, Useful. We hope that you'll find Ruru to be
all those things!

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
