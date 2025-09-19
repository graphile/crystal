# graphql-codegen-grafast

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/twitter-@GrafastHQ-blueviolet.svg)](https://twitter.com/GrafastHQ)

GraphQL Codegen support for [Grafast](https://grafast.org/grafast/)'s
`makeGrafastSchema`.

Types only.

**HIGHLY EXPERIMENTAL** - expect breaking changes in every release.

## Usage

TODO

```
yarn add --dev @graphql-codegen/cli graphql-codegen-grafast
```

```ts
// codegen.ts
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.ts",
  ignoreNoDocuments: true,
  generates: {
    "./schema-generated.ts": {
      plugins: ["typescript", "grafast"],
      config: {
        overridesFile: "./schema-manual-types.ts",
      },
    },
  },
};

export default config;
```

```ts
// schema.ts
import { get } from "grafast";
import { typedMakeGrafastSchema } from "./schema-generated.js";

const schema = typedMakeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      character(id: Int!): Character
    }

    interface Character {
      id: Int!
      name: String!
    }
  `,
  objects: {
    Character: {
      plans: {
        name($character) {
          return get($character, "name");
        },
      },
    },
    // ...
  },
  unions: {
    // ...
  },
  interfaces: {
    // ...
  },
  inputObjects: {
    // ...
  },
  scalars: {
    // ...
  },
  enums: {
    // ...
  },
});
```

```ts
// schema-manual-types.ts
import type { Maybe, Step } from "grafast";
import type { CharacterData } from "./data.js";

// IMPORTANT: Steps must represent the nullable version (suitable for returning
// from a plan resolver). Should you wish to specify a different (non-nullable)
// version that's suitable as a field plan resolver's first argument, use the
// `source:` key in addition to specifying `nullable:`.
export type Overrides = {
  Character: {
    nullable: Step<Maybe<CharacterData>>;
  };
};
```

```
yarn graphql-codegen
```

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably, we ask all individuals and
businesses that use it to help support its ongoing maintenance and development
via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://www.the-guild.dev/"><img src="https://graphile.org/images/sponsors/theguild.png" width="90" height="90" alt="The Guild" /><br />The Guild</a> *</td>
<td align="center"><a href="https://gosteelhead.com/"><img src="https://graphile.org/images/sponsors/steelhead.svg" width="90" height="90" alt="Steelhead" /><br />Steelhead</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->
