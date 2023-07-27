---
layout: page
path: /postgraphile/smart-tags-file/
title: The postgraphile.tags.json5 file
---

You can load `TagsFilePlugin` as part of your configuration to have
PostGraphile read a `postgraphile.tags.json5` file from the current directory
and process the tags and descriptions therein.

```js title="graphile.config.mjs"
import { TagsFilePlugin } from "postgraphile/utils";

export default {
  // ...
  plugins: [TagsFilePlugin],
};
```

### Merging/Overriding

If you provide a description for an entity in `postgraphile.tags.json5` then
that description will override any previous descriptions.

If you provide tags for an entity in `postgraphile.tags.json5`, those tags will
be _merged_ with previous tags overriding tags with the same names but retaining
other tags.

### File format

The file is in JSON5 (you can just use regular JSON if you prefer, but the
extension must be `.json5`) and is formatted like this:

```json5
{
  version: 1,
  config: {
    /*
     * There can be entries here for:
     *
     * - `class`: for tables, composite types, views and materialized views
     * - `attribute`: for columns/attributes (of any 'class' type)
     * - `constraint`: for table constraints
     * - `procedure`: for functions/procedures
     */
    class: {
      /*
       * The next level describes the named type. We've just used the table
       * name `"post"` but it could be `"my_schema.post"` if you have multiple
       * tables with the same name and you don't want this rule to apply to
       * all of them.
       */
      post: {
        /*
         * This will override the description sourced from the PostgreSQL COMMENT.
         */
        description: "A post within our forum.",

        /*
         * Add tags specific to the 'post' table here. You can omit this if you
         * don't want to add any tags.
         */
        tags: {
          foreignKey: [
            "(default_user_id) references user (id)|@fieldName defaultUser",
            "(organization_id) references organization (id)|@fieldName organization",
          ],
        },

        /*
         * We've added a shortcut to class-types so you can tag/describe
         * columns at the same time of the class.
         */
        attribute: {
          /*
           * Assuming `body` is one of the columns in the 'post' table.
           */
          body: {
            /*
             * Optional description, if provided overrides the PostgreSQL
             * `COMMENT ON COLUMN post.body`.
             */
            description: "The body of the post",
            tags: {
              /*
               * Here we indicate that the 'body' field will not be available
               * in the update mutation.
               */
              omit: "update",
            },
          },
        },
      },
    },
  },
}
```

## Reading from an alternative path

If you want to store your tags in a different file (e.g.
`postgraphile.tags.json` to support a wider range of parsers) then you can use
a custom plugin instead:

```js title="graphile.config.mjs"
import { makePgSmartTagsFromFilePlugin } from "postgraphile/utils";

export default {
  // ...
  plugins: [
    makePgSmartTagsFromFilePlugin(
      // JSON and JSONC are also JSON5 compatible, so you can use these extensions if you prefer:
      "/path/to/my/tags.file.json",
    ),
  ],
};
```

If you're trying to avoid the `fs` module (e.g. because you're using webpack)
then building and loading a basic smart tags plugin that doesn't read from the
file system might look something like this:

```js title="graphile.config.mjs"
import { makeJSONPgSmartTagsPlugin } from "postgraphile/utils";

const MySmartTagsPlugin = makeJSONPgSmartTagsPlugin({
  version: 1,
  config: {
    class: {
      post: {
        tags: {
          omit: "update",
        },
      },
    },
  },
});

export default {
  // ...
  plugins: [MySmartTagsPlugin],
};
```

### Going further

For greater flexibility, you might choose to check out
[makePgSmartTagsPlugin](./make-pg-smart-tags-plugin/).
