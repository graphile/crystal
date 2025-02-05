---
layout: page
path: /postgraphile/smart-tags-file/
title: The postgraphile.tags.json5 file
---

When running PostGraphile in CLI mode, PostGraphile will automatically look for
a `postgraphile.tags.json5` file in the current directory, and will process the
tags and descriptions therein.

In library mode, you can add a plugin to load the `postgraphile.tags.json5` file
(see below for details).

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

### Library usage

Unlike the CLI, PostGraphile library mode doesn't automatically import the
`postgraphile.tags.json5` file for you, so you need to do a little extra work.

The easiest solution is to use our pre-build plugin bundled with `postgraphile`:

```js
app.use(
  postgraphile(DATABASE_URL, SCHEMAS, {
    // ...
    appendPlugins: [
      // Automatically loads and watches the 'postgraphile.tags.json5' file:
      require("postgraphile/plugins").TagsFilePlugin,
    ],
  }),
);
```

You could also pass an alternative path to your tags file, e.g.:

```js
const postGraphileOptions = {
  appendPlugins: [
    require("postgraphile/plugins").makePgSmartTagsFromFilePlugin(
      // JSON and JSONC are also JSON5 compatible, so you can use these extensions if you prefer:
      "/path/to/my/tags.file.json",
    ),
  ],
};
```

If you're trying to avoid the `fs` module (e.g. because you're using webpack)
then a basic smart tags plugin that doesn't read from the file system would look
something like this:

```js
// MySmartTagsPlugin.js

const { makeJSONPgSmartTagsPlugin } = require("graphile-utils");

module.exports = makeJSONPgSmartTagsPlugin({
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
```

You can load this plugin with the `appendPlugins` library option:

```js
const MySmartTagsPlugin = require("./MySmartTagsPlugin");
app.use(
  postgraphile(DATABASE_URL, SCHEMAS, {
    // ...
    appendPlugins: [MySmartTagsPlugin],
  }),
);
```

### Going further

For greater flexibility, you might choose to check out
[makePgSmartTagsPlugin](./make-pg-smart-tags-plugin).
