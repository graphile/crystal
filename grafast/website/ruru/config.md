# Configuration

Configuration for Ruru is managed via a [Graphile Config
preset](https://star.graphile.org/graphile-config/preset), and uses the `ruru`
scope:

```ts title="graphile.config.ts"
import type {} from "ruru";

const preset: GraphileConfig.Preset = {
  ruru: {
    /* options here */
  },
};

export default preset;
```

## Reference

<!-- START:OPTIONS:ruru -->

```ts
{
  clientConfig?: RuruClientConfig;
  enableProxy?: boolean;
  endpoint?: string;
  htmlParts?: {
    metaTags?: string | ((original: string, clientConfig: BakedRuruClientConfig, serverConfig: RuruConfig, htmlParts: RuruHTMLParts, key: keyof RuruHTMLParts) => string) | undefined;
    titleTag?: string | ((original: string, clientConfig: BakedRuruClientConfig, serverConfig: RuruConfig, htmlParts: RuruHTMLParts, key: keyof RuruHTMLParts) => string) | undefined;
    ... 5 more ...;
    bodyInitScript?: string | ... 1 more ... | undefined;
};
  port?: number;
  staticPath?: string;
  subscriptionEndpoint?: string;
  subscriptions?: boolean;
}
```

### ruru.clientConfig

Type: `RuruClientConfig | undefined`

Will be serialized and sent to the client

### ruru.enableProxy

Type: `boolean | undefined`

### ruru.endpoint

Type: `string | undefined`

The URL to the GraphQL endpoint. (http:// or https://)

### ruru.htmlParts

Type: `{
    metaTags?: string | ((original: string, clientConfig: BakedRuruClientConfig, serverConfig: RuruConfig, htmlParts: RuruHTMLParts, key: keyof RuruHTMLParts) => string) | undefined;
    titleTag?: string | ((original: string, clientConfig: BakedRuruClientConfig, serverConfig: RuruConfig, htmlParts: RuruHTMLParts, key: keyof RuruHTMLParts) => string) | undefined;
    ... 5 more ...;
    bodyInitScript?: string | ... 1 more ... | undefined;
} | undefined`

Override the HTML parts that are used to build the Ruru

### ruru.port

Type: `number | undefined`

The port for `ruru` CLI to listen on.

### ruru.staticPath

Type: `string | undefined`

Ruru's static assets must be served for Ruru to work. Pass the URL to the
root of this folder; it must end in a slash. Defaults to
`https://unpkg.com/ruru@${version}/static/` in most places, though the CLI
defaults to `/ruru-static/` since it serves its own files.

### ruru.subscriptionEndpoint

Type: `string | undefined`

The URL to the GraphQL subscriptions endpoint. (ws:// or wss://)

### ruru.subscriptions

Type: `boolean | undefined`

<!-- END:OPTIONS:ruru -->
