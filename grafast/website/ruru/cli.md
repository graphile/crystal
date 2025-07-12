# CLI

The CLI requires Node 22+ to be installed and is a great option for inspecting
any GraphQL API because it can proxy (`-P`) requests to work around CORS issues.

## Instant usage!

If you have Node installed, you can instantly run `ruru` without permanently
installing it using the `npx` command. Here's an example command to explore
[@trevorblades](https://twitter.com/trevorblades)'s countries API:

```
npx ruru -SPe https://countries.trevorblades.com/graphql
```

(`-S` enables subscriptions, `-P` proxies GraphQL requests; neither of these are
needed for Trevor's API, but you might want them for your API.)

## Installation

Install Ruru:

```bash npm2yarn
npm install --save-dev ruru
```

Then you can run something like the following to automatically proxy requests
(bypassing CORS issues):

```bash npm2yarn
npx ruru -SPe http://localhost:5678/graphql
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
