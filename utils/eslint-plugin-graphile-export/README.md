# eslint-plugin-graphile-export

[![GitHub Sponsors](https://img.shields.io/github/sponsors/benjie?color=ff69b4&label=github%20sponsors)](https://github.com/sponsors/benjie)
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Follow](https://img.shields.io/badge/BSky-@Graphile.org-006aff.svg)](https://bsky.app/profile/graphile.org)
[![Follow](https://img.shields.io/badge/Mastodon-@Graphile.fosstodon.org-6364ff.svg)](https://fosstodon.org/@graphile)

`eslint-plugin-schema-exporter` is an ESLint plugin to help ensure you've listed
all your scopes for functions.

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably, we ask all individuals and
businesses that use it to help support its ongoing maintenance and development
via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="https://gosteelhead.com/"><img src="https://graphile.org/images/sponsors/steelhead.svg" width="90" height="90" alt="Steelhead" /><br />Steelhead</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## Documentation

Add to your eslintrc:

```jsonc
{
  //...
  "plugins": [
    //...
    "graphile-export"
    //...
  ],
  "extends": [
    // ...
    "plugin:graphile-export/recommended"
  ]
  // ...
}
```

NOTE: this plugin will automatically add `EXPORTABLE` callbacks in places where
it thinks it's suitable, but it currently does not add the `EXPORTABLE` import
to the file. You'll need to add that yourself:

```ts
import { EXPORTABLE } from "graphile-export";
```

TODO: more docs!

## The rules

TODO: document them

```
      rules: {
        "graphile-export/exhaustive-deps": 2,
        "graphile-export/export-methods": 2,
        "graphile-export/export-instances": 2,
        "graphile-export/export-subclasses": 2,
        "graphile-export/no-nested": 2,
      },
```
