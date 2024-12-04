---
sidebar_position: 5
---

# Other

Below you'll find some small plugins that people have written. Larger plugins likely have their own dedicated repositories, these are typically just examples of how to achieve a small goal.

_This is a work in progress, in future these plugins will be automatically tested but we've not got quite that far yet, so my apologies if you come across any issues._

## ExtractSmartTagsPlugin

```ts
/**
 * This plugin will create a file `smartTags.json` containing all of the smart
 * tags gathered from all of the various sources (smart comments, smart tags,
 * plugins, etc etc). This provides a relatively easy migration path from using
 * smart comments to using smart tags instead. Neither Smart Comments nor Smart
 * Tags are "better" - they each have trade offs - you can use which ever one
 * matches your teams development flow better (or even mix and match!).
 *
 * Author phryneas (https://github.com/graphile/graphile.github.io/pull/243)
 */
const { writeFile } = require("fs");

module.exports = (builder) => {
  builder.hook("init", (_, build) => {
    function sortStuff(a, b) {
      const aSchema =
        "namespaceName" in a ? a.namespaceName : a.class.namespaceName;
      const bSchema =
        "namespaceName" in b ? b.namespaceName : b.class.namespaceName;
      return (
        aSchema.localeCompare(bSchema) * 100 + a.name.localeCompare(b.name)
      );
    }
    const smart = {
      version: 1,
      config: {
        class: [...build.pgIntrospectionResultsByKind.class]
          .sort(sortStuff)
          .reduce((acc, pgClass) => {
            let attribute = [...pgClass.attributes]
              .sort((a, b) => a.name.localeCompare(b.name))
              .reduce((acc, pgAttr) => {
                const tags =
                  Object.keys(pgAttr.tags).length > 0 ? pgAttr.tags : undefined;
                if (pgAttr.description || tags) {
                  acc[pgAttr.name] = {
                    ...(pgAttr.description
                      ? {
                          description: pgAttr.description,
                        }
                      : {}),
                    tags,
                  };
                }
                return acc;
              }, {});
            if (Object.keys(attribute).length === 0) {
              attribute = undefined;
            }
            let constraint = [...pgClass.constraints]
              .sort(sortStuff)
              .reduce((acc, pgConst) => {
                if (pgConst.name.startsWith("FAKE_")) {
                  return acc;
                }
                const tags =
                  Object.keys(pgConst.tags).length > 0
                    ? pgConst.tags
                    : undefined;
                if (pgConst.class && (pgConst.description || tags)) {
                  acc[pgConst.class.namespaceName + "." + pgConst.name] = {
                    ...(pgConst.description
                      ? {
                          description: pgConst.description,
                        }
                      : {}),
                    tags,
                  };
                }
                return acc;
              }, {});
            if (Object.keys(constraint).length === 0) {
              constraint = undefined;
            }
            const tags =
              Object.keys(pgClass.tags).length > 0 ? pgClass.tags : undefined;
            if (pgClass.description || tags || attribute)
              acc[pgClass.namespaceName + "." + pgClass.name] = {
                ...(pgClass.description
                  ? {
                      description: pgClass.description,
                    }
                  : {}),
                tags,
                attribute,
                constraint,
              };
            return acc;
          }, {}),
        procedure: [...build.pgIntrospectionResultsByKind.procedure]
          .sort(sortStuff)
          .reduce((acc, pgProc) => {
            if (pgProc.name.startsWith("FAKE_")) {
              return acc;
            }
            const tags =
              Object.keys(pgProc.tags).length > 0 ? pgProc.tags : undefined;
            if (pgProc.description || tags) {
              acc[pgProc.namespaceName + "." + pgProc.name] = {
                ...(pgProc.description
                  ? {
                      description: pgProc.description,
                    }
                  : {}),
                tags,
              };
            }
            return acc;
          }, {}),
      },
    };
    writeFile(
      __dirname + "/smartTags.json",
      JSON.stringify(smart, undefined, 2),
      (e) => {
        console.log(e);
      },
    );
    return _;
  });
};
```
