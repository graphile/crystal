# graphql-parse-resolve-info

<span class="badge-patreon"><a href="https://patreon.com/benjie" title="Support Graphile development on Patreon"><img src="https://img.shields.io/badge/sponsor-via%20Patreon-orange.svg" alt="Patreon sponsor button" /></a></span>
[![Discord chat room](https://img.shields.io/discord/489127045289476126.svg)](http://discord.gg/graphile)
[![Package on npm](https://img.shields.io/npm/v/graphql-parse-resolve-info.svg?style=flat)](https://www.npmjs.com/package/graphql-parse-resolve-info)
![MIT license](https://img.shields.io/npm/l/graphql-parse-resolve-info.svg)
[![Follow](https://img.shields.io/badge/twitter-@GraphileHQ-blue.svg)](https://twitter.com/GraphileHQ)

Parses a `GraphQLResolveInfo` object into a tree of the fields that are being
requested to enable optimisations to your GraphQL schema (e.g. to determine
which fields are required from the backend).

Useful for optimising your GraphQL resolvers by allowing them to look ahead in
the request, reducing the number of SQL queries or HTTP requests required to
complete the GraphQL request.

Also provides a quick way to get the alias of the current field being resolved.

<!-- SPONSORS_BEGIN -->

## Crowd-funded open-source software

To help us develop this software sustainably under the MIT license, we ask
all individuals and businesses that use it to help support its ongoing
maintenance and development via sponsorship.

### [Click here to find out more about sponsors and sponsorship.](https://www.graphile.org/sponsor/)

And please give some love to our featured sponsors 🤩:

<table><tr>
<td align="center"><a href="http://chads.website"><img src="https://graphile.org/images/sponsors/chadf.png" width="90" height="90" alt="Chad Furman" /><br />Chad Furman</a> *</td>
<td align="center"><a href="https://storyscript.io/?utm_source=postgraphile"><img src="https://graphile.org/images/sponsors/storyscript.png" width="90" height="90" alt="Storyscript" /><br />Storyscript</a> *</td>
<td align="center"><a href="https://postlight.com/?utm_source=graphile"><img src="https://graphile.org/images/sponsors/postlight.jpg" width="90" height="90" alt="Postlight" /><br />Postlight</a> *</td>
</tr></table>

<em>\* Sponsors the entire Graphile suite</em>

<!-- SPONSORS_END -->

## API

### `parseResolveInfo(resolveInfo)`

Alias: `parse`

Gets the tree of subfields of the current field that is being requested,
returning the following properties (recursively):

- `name`: the name of the GraphQL field
- `alias`: the alias this GraphQL field has been requested as, or if no alias was specified then the `name`
- `args`: the arguments this field was called with; at the root level this
  will be equivalent to the `args` that the `resolve(data, args, context, resolveInfo) {}` method receives, at deeper levels this allows you to get the
  `args` for the nested fields without waiting for their resolvers to be called.
- `fieldsByTypeName`: an object keyed by GraphQL object type names, where the
  values are another object keyed by the aliases of the fields requested with
  values of the same format as the root level (i.e. `{alias, name, args, fieldsByTypeName}`); see below for an example

Note that because GraphQL supports interfaces a resolver may return items of
different types. For this reason, we key the fields by the GraphQL type name of
the various fragments that were requested into the `fieldsByTypeName` field.

Once you know which specific type the result is going to be, you can then use
this type (and its interfaces) to determine which sub-fields were requested -
we provide a `simplifyParsedResolveInfoFragmentWithType` helper to aid you with
this. In many cases you will know what type the result will be (because it can
only be one type) so you will probably use this helper heavily.

Example usage:

```js
const {
	parseResolveInfo,
	simplifyParsedResolveInfoFragmentWithType
} = require('graphql-parse-resolve-info');
// or import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';

new GraphQLObjectType({
  name: ...
  fields: {
    ...
    foo: {
      type: new GraphQLNonNull(ComplexType),
      resolve(data, args, context, resolveInfo) {
        const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
					parsedResolveInfoFragment,
					ComplexType
				);
        console.dir(fields);
        ...
      }
    }
  }
});
```

### `simplifyParsedResolveInfoFragmentWithType(parsedResolveInfoFragment, ReturnType)`

Alias: `simplify`

Given an object of the form returned by `parseResolveInfo(...)` (which can be
the root-level instance, or it could be one of the nested subfields) and a
GraphQL type this method will return an object of the form above, with an
additional field `fields` which only contains the fields compatible with the
specified `ReturnType`.

Or, in other words, this simplifies the `fieldsByTypeName` to an object of only
the fields compatible with `ReturnType`.

Example usage:

```js
const {
	parseResolveInfo,
	simplifyParsedResolveInfoFragmentWithType
} = require('graphql-parse-resolve-info');

new GraphQLObjectType({
  name: ...
  fields: {
    ...
    foo: {
      type: new GraphQLNonNull(ComplexType),
      resolve(data, args, context, resolveInfo) {
        const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);

        const { fields } = simplifyParsedResolveInfoFragmentWithType(
					parsedResolveInfoFragment,
					ComplexType
				);
        ...
      }
    }
  }
});
```

### `getAliasFromResolveInfo(resolveInfo)`

Alias: `getAlias`

Returns the alias of the field being requested (or, if no alias was specified,
then the name of the field).

Example:

```js
const { getAliasFromResolveInfo } = require('graphql-parse-resolve-info');

new GraphQLObjectType({
  name: ...
  fields: {
    ...
    foo: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(data, args, context, resolveInfo) {
        const alias = getAliasFromResolveInfo(resolveInfo);
        return alias;
      }
    }
  }
});
```

## Example

For the following GraphQL query:

```graphql
{
  allPosts {
    edges {
      cursor
      node {
        ...PostDetails
        author: personByAuthorId {
          firstPost {
            ...PostDetails
          }
          friends {
            nodes {
              ...PersonDetails
            }
            totalCount
            pageInfo {
              startCursor
            }
          }
        }
      }
    }
  }
}

fragment PersonDetails on Person {
  id
  name
  firstName
}

fragment PostDetails on Post {
  id
  headline
  headlineTrimmed
  author: personByAuthorId {
    ...PersonDetails
  }
}
```

The following resolver in the `allPosts` field:

```js
const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    allPosts: {
      type: new GraphQLNonNull(PostsConnection),
      resolve(parent, args, context, resolveInfo) {
        const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
        const simplifiedFragment = simplifyParsedResolveInfoFragmentWithType(
          parsedResolveInfoFragment,
          resolveInfo.returnType
        );
        // ...
      },
    },

    // ...
  },
});
```

has `parsedResolveInfoFragment`:

```js
{ alias: 'allPosts',
  name: 'allPosts',
  args: {},
  fieldsByTypeName:
   { PostsConnection:
      { edges:
         { alias: 'edges',
           name: 'edges',
           args: {},
           fieldsByTypeName:
            { PostsEdge:
               { cursor:
                  { alias: 'cursor',
                    name: 'cursor',
                    args: {},
                    fieldsByTypeName: {} },
                 node:
                  { alias: 'node',
                    name: 'node',
                    args: {},
                    fieldsByTypeName:
                     { Post:
                        { id: { alias: 'id', name: 'id', args: {}, fieldsByTypeName: {} },
                          headline:
                           { alias: 'headline',
                             name: 'headline',
                             args: {},
                             fieldsByTypeName: {} },
                          headlineTrimmed:
                           { alias: 'headlineTrimmed',
                             name: 'headlineTrimmed',
                             args: {},
                             fieldsByTypeName: {} },
                          author:
                           { alias: 'author',
                             name: 'personByAuthorId',
                             args: {},
                             fieldsByTypeName:
                              { Person:
                                 { id: { alias: 'id', name: 'id', args: {}, fieldsByTypeName: {} },
                                   name: { alias: 'name', name: 'name', args: {}, fieldsByTypeName: {} },
                                   firstName:
                                    { alias: 'firstName',
                                      name: 'firstName',
                                      args: {},
                                      fieldsByTypeName: {} },
                                   firstPost:
                                    { alias: 'firstPost',
                                      name: 'firstPost',
                                      args: {},
                                      fieldsByTypeName:
                                       { Post:
                                          { id: { alias: 'id', name: 'id', args: {}, fieldsByTypeName: {} },
                                            headline:
                                             { alias: 'headline',
                                               name: 'headline',
                                               args: {},
                                               fieldsByTypeName: {} },
                                            headlineTrimmed:
                                             { alias: 'headlineTrimmed',
                                               name: 'headlineTrimmed',
                                               args: {},
                                               fieldsByTypeName: {} },
                                            author:
                                             { alias: 'author',
                                               name: 'personByAuthorId',
                                               args: {},
                                               fieldsByTypeName:
                                                { Person:
                                                   { id: { alias: 'id', name: 'id', args: {}, fieldsByTypeName: {} },
                                                     name: { alias: 'name', name: 'name', args: {}, fieldsByTypeName: {} },
                                                     firstName:
                                                      { alias: 'firstName',
                                                        name: 'firstName',
                                                        args: {},
                                                        fieldsByTypeName: {} } } } } } } },
                                   friends:
                                    { alias: 'friends',
                                      name: 'friends',
                                      args: {},
                                      fieldsByTypeName:
                                       { PeopleConnection:
                                          { nodes:
                                             { alias: 'nodes',
                                               name: 'nodes',
                                               args: {},
                                               fieldsByTypeName:
                                                { Person:
                                                   { id: { alias: 'id', name: 'id', args: {}, fieldsByTypeName: {} },
                                                     name: { alias: 'name', name: 'name', args: {}, fieldsByTypeName: {} },
                                                     firstName:
                                                      { alias: 'firstName',
                                                        name: 'firstName',
                                                        args: {},
                                                        fieldsByTypeName: {} } } } },
                                            totalCount:
                                             { alias: 'totalCount',
                                               name: 'totalCount',
                                               args: {},
                                               fieldsByTypeName: {} },
                                            pageInfo:
                                             { alias: 'pageInfo',
                                               name: 'pageInfo',
                                               args: {},
                                               fieldsByTypeName:
                                                { PageInfo:
                                                   { startCursor:
                                                      { alias: 'startCursor',
                                                        name: 'startCursor',
                                                        args: {},
                                                        fieldsByTypeName: {} } } } } } } } } } } } } } } } } } },
```

and the simplified `simplifiedFragment` is the same as
`parsedResolveInfoFragment`, but with the additional root-level property
`fields` which compresses the root-level property `fieldsByTypeName` to a
single-level object containing only the fields compatible with
`resolveInfo.returnType` (in this case: only `edges`):

```js
{ alias: 'allPosts',
  name: 'allPosts',
  args: {},
  fieldsByTypeName:
		...as before...
  fields:
   { edges:
      { alias: 'edges',
        name: 'edges',
        args: {},
        fieldsByTypeName:
           ...as before...
```

## Thanks

This project was originally based on https://github.com/tjmehta/graphql-parse-fields, but has evolved a lot since then.
