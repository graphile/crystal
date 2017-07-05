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

To get the tree of subfields of the current field that are being requested:

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

(Note that because GraphQL supports interfaces and hence a resolver may return
items of different types we key the fields by the GraphQL type name of the
various fragments that were requested. Once you know what type the result was,
you can then use this type (and its interfaces) to determine which sub-fields
were requested. It's quite commont to know that your result will be of a single
type, so we provide a helper that will simplify this for you by passing it the
expected type.)

Usage: alias
------------

To get the alias of the current field being resolved (defaults to the field name if no alias was specified):

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
