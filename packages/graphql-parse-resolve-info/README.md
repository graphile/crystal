graphql-parse-resolve-info
==========================

Parses a GraphQLResolveInfo object into a tree of the fields that are being
requested to enable optimisations to your GraphQL schema (e.g. to determine
which fields are required from the SQL database).

Useful for optimising your GraphQL resolvers by allowing them to look ahead in
the request, reducing the number of SQL queries or HTTP requests required to
complete the GraphQL request.

Also provides a quick way to get the alias of the current field being resolved.

Usage: requested subfields
--------------------------

To get the tree of subfields of the current field that is being requested:

```js
const parseResolveInfo = require('graphql-parse-resolve-info');
// or import parseResolveInfo from 'graphql-parse-resolve-info';

new GraphQLObjectType({
  name: ...
  fields: {
    ...
    foo: {
      type: new GraphQLNonNull(ComplexType),
      resolve(data, args, context, resolveInfo) {
        const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
        const { fields } =
          parseResolveInfo.simplifyParsedResolveInfoFragmentWithType(parsedResolveInfoFragment, ComplexType);
        console.dir(fields);
        ...
      }
    }
  }
});
```

### `parseResolveInfo(resolveInfo)`

Returns the following properties (recursively):

- `name`: the name of the GraphQL field
- `alias`: the alias this GraphQL field has been requested as, or if no alias was specified then the `name`
- `args`: the arguments this field was called with; at the root level this
  will be equivalent to the `args` that the `resolve(data, args, context,
  resolveInfo) {}` method receives, at deeper levels this allows you to get the
  `args` for the nested fields without waiting for their resolvers to be called.
- `fieldsByTypeName`: an object keyed by GraphQL object type names, where the
  values are another object keyed by the aliases of the fields requested with
  values of the same format as this (i.e. `{alias, name, args,
  fieldsByTypeName}`)

Note that because GraphQL supports interfaces a resolver may return items of
different types. For this reason, we key the fields by the GraphQL type name of
the various fragments that were requested into the `fieldsByTypeName` field.

Once you know which specific type the result is going to be, you can then use
this type (and its interfaces) to determine which sub-fields were requested -
we provide a `simplifyParsedResolveInfoFragmentWithType` helper to aid you with
this. In many cases you will know what type the result will be (because it can
only be one type) so you will probably use this helper heavily.

### `parseResolveInfo.simplify(parsedResolveInfoFragment, ReturnType)`

Alias: `simplifyParsedResolveInfoFragmentWithType`

Given an object of the form returned by `parseResolveInfo(...)` (which can be
the root-level instance, or it could be one of the nested subfields) and a
GraphQL type this method will return an object of the form above, with an
additional field `fields` which only contains the fields compatible with the
specified `ReturnType`.

Or, in other words, this simplifies the `fieldsByTypeName` to an object of only
the fields compatible with `ReturnType`.

Usage: alias
------------

### `parseResolveInfo(resolveInfo, { aliasOnly: true })`

Instead of returning an object as above, if you specify `aliasOnly: true` then
only a string is returned: the alias of the field being requested (or, if none
were provided, then the name of the field).

Example:

```js
const parseResolveInfo = require('graphql-parse-resolve-info');

new GraphQLObjectType({
  name: ...
  fields: {
    ...
    foo: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(data, args, context, resolveInfo) {
        const alias = parseResolveInfo(resolveInfo, { aliasOnly: true });
        return alias;
      }
    }
  }
});
```

Example
-------

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
  name: 'Query',
  fields: {


    allPosts: {
      type: new GraphQLNonNull(PostsConnection),
      resolve(parent, args, context, resolveInfo) {
        const parsedResolveInfoFragment = parseResolveInfo(
          resolveInfo
        );
        const simplifiedFragment = parseResolveInfo.simplify(
          parsedResolveInfoFragment,
          resolveInfo.returnType
        );
        // ...
      },
    }


    // ...
  }
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

_Note: the `ast` fields has been omitted at every level to make this easier to read._

and the simplified `simplifiedFragment` is the same as
`parsedResolveInfoFragment`, but with the additional root-level property
`fields` which compresses the root-level property `fieldsByTypeName` to a
single-level object containing only the fields compatible with
`resolveInfo.returnType` (in this case: only `edges`):

```js
  fields:
   { edges:
      { alias: 'edges',
        name: 'edges',
        args: {},
        fieldsByTypeName:
         { PostsEdge:
          ...as before...
```

Thanks
------

This project was originally based on https://github.com/tjmehta/graphql-parse-fields, but has evolved a lot since then.
