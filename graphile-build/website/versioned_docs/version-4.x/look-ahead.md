---
layout: page
path: /graphile-build/look-ahead/
title: "Advanced: Look Ahead"
---

<p class="intro">
Traditionally in GraphQL APIs DataLoader is used to batch requests to minimize
the impact of N+1 queries. DataLoader can be use with Graphile Engine in the same
way as it is with GraphQL. However, sometimes DataLoader isn't the best
approach for your system, so Graphile Engine provides a powerful Look-Ahead
functionality you can use to optimize your GraphQL queries. This is
particularly well suited to environments that allow you to specify complex
structures to be returned (such as databases or other GraphQL APIs), but is
generic enough that it can be used for many use-cases.
</p>

### Seeing which sub-fields were requested

The
[`resolve` method in GraphQL](http://graphql.org/graphql-js/type/#graphqlobjecttype)
is actually called with 4 arguments:

- source - the data provided by the parent field
- args - the arguments passed to the field in the query
- context - the context object used throughout the resolvers
- resolveInfo - an instance of GraphQLResolveInfo

This 4th argument is the one we're interested in because it contains a number of
goodies. But some of these are hard to digest, so we give you some helpers...

##### `parseResolveInfo(resolveInfo)`

Will take the AST from the GraphQLResolveInfo and extract from it a nested
object consisting of:

- name - the name of the current field
- alias - the alias the current field was requested as
- args - the arguments passed to the field in the query
- fieldsByTypeName - the sub-fields that were requested on the current object
  broken down by the names of the GraphQL types that could be returned.

Because GraphQL supports Union and other complex types, it's possible to request
different sub-fields depending on the type of data that's returned from a field,
hence `fieldsByTypeName`. If you happen to know the type that's going to be
returned then you can simplify with the next method...

From
[`graphql-parse-resolve-info`](https://github.com/graphile/graphile-engine/tree/master/packages/graphql-parse-resolve-info#parseresolveinforesolveinfo)

<!-- TODO: example -->

##### `simplifyParsedResolveInfoFragmentWithType(parsedResolveInfoFragment, graphQLType)`

If you know the precise named type that your field will return you can pass the
result of `parseResolveInfo(resolveInfo)` to this method along with the named
type `graphQLType` and we'll return a similar object with an additional `fields`
property that are only the fields that are compatible with the `graphQLType`.

From
[`graphql-parse-resolve-info`](https://github.com/graphile/graphile-engine/tree/master/packages/graphql-parse-resolve-info#simplifyparsedresolveinfofragmentwithtypeparsedresolveinfofragment-returntype)

<!-- TODO: example -->

### Declaring meta-data associated with a field

When you add a field to a `GraphQLObjectType` you may specify metadata
associated with this field.

Resolved metadata in Graphile Engine (see the next section) will be an object
with string keys and values which are an array of arbitrary JavaScript values.
If the same metadata key was added multiple times it will simply add to the
array.

There are three ways to declare meta-data with a field:

#### When initially defining the object fields

Instead of passing an object to `fields`, you can pass a function. This function
will be passed the methods:

- `addDataGeneratorForField(fieldName, generatorFn)` - will associate the data
  generator with the field

```js{6-10,22-25}
const MyObject = newWithHooks(GraphQLObjectType, {
  name: "MyObject",
  fields: ({ addDataGeneratorForField }) => {
    addDataGeneratorForField("id", ({ alias }) => {
      return {
        map: obj => ({ [alias]: obj.ID }),
      };
    });
    addDataGeneratorForField("caps", ({ alias }) => {
      return {
        map: obj => ({ [alias]: obj.CAPS }),
      };
    });
    addDataGeneratorForField("random", ({ alias }) => {
      return {
        map: () => ({ [alias]: Math.floor(Math.random() * 10000) }),
      };
    });
    return {
      id: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: resolveAlias,
      },
      caps: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: resolveAlias,
      },
      random: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: resolveAlias,
      },
    };
  },
});
```

#### When creating an individual field

You can use the `fieldWithHooks` helper, passing it a function:

```js{5-15}
const MyObject = newWithHooks(GraphQLObjectType, {
  name: "MyObject",
  fields: ({ fieldWithHooks }) => {
    return {
      id: fieldWithHooks("id", ({ addDataGenerator }) => {
        addDataGenerator(({ alias }) => {
          return {
            map: obj => ({ [alias]: obj.ID }),
          };
        });
        return {
          type: new GraphQLNonNull(GraphQLString),
          resolve: resolveAlias,
        };
      }),
      caps: fieldWithHooks("caps", ({ addDataGenerator }) => {
        addDataGenerator(({ alias }) => {
          return {
            map: obj => ({ [alias]: obj.CAPS }),
          };
        });
        return {
          type: new GraphQLNonNull(GraphQLString),
          resolve: resolveAlias,
        };
      }),
      random: fieldWithHooks("random", ({ addDataGenerator }) => {
        addDataGenerator(({ alias }) => {
          return {
            map: () => ({ [alias]: Math.floor(Math.random() * 10000) }),
          };
        });
        return {
          type: new GraphQLNonNull(GraphQLInt),
          resolve: resolveAlias,
        };
      }),
    };
  },
});
```

#### When processing arguments: `addArgDataGenerator`

Arguments also influence what we should do, so we can use `addArgDataGenerator`
to provide look-ahead data based on the arguments received.

```js{7-12}
const MyObject = newWithHooks(GraphQLObjectType, {
  name: "MyObject",
  fields: ({ fieldWithHooks }) => {
    return {
      connection: fieldWithHooks("connection", ({ addArgDataGenerator }) => {
        addArgDataGenerator(function connectionFirst({ first }) {
          if (first) {
            return { limit: [first] };
          }
        });
        return {
          type: ConnectionType,
          args: {
            first: {
              type: GraphQLInt,
            },
          },
        };
      }),
    };
  },
});
```

#### In a `GraphQLObjectType:fields:field` hook

Hooks can also associate metadata with a field; they are passed
`addDataGenerator` on the Context argument, for example:

```js{10-14}
function MyObjectAddIdDataGeneratorPlugin(builder) {
  builder.hook(
    "GraphQLObjectType:fields:field",
    (field, _, { fieldName, Self, addDataGenerator }) => {
      if (Self.name !== "MyObject" || fieldName !== "id") {
        return field;
      }
      addDataGenerator(({ alias }) => {
        return {
          map: obj => ({ [alias]: obj.ID }),
        };
      });
      return field;
    }
  );
}
```

### Determining the meta-data requested subfields have specified

When it comes to `resolve` time we need to know what meta-data is available as
it may influence what we do. We can only do this on a per-field (since every
field will fetch data in a different way) so to use this we must use
`fieldWithHooks` to get access to the `getDataFromParsedResolveInfoFragment`
method:

#### `getDataFromParsedResolveInfoFragment(parsedResolveInfoFragment, type)`

Given a `parseResolveInfoFragment` and an expected return type, this will return
the metadata associated with this field.

```js{9,21-24,30-32}
const Query = newWithHooks(GraphQLObjectType, {
  name: "Query",
  fields: ({ fieldWithHooks }) => ({
    myConnection: fieldWithHooks(
      "myConnection",
      ({ addArgDataGenerator, getDataFromParsedResolveInfoFragment }) => {
        addArgDataGenerator(function connectionFirst({ first }) {
          if (first) {
            return { limit: [first] };
          }
        });
        return {
          type: MyConnection
          args: {
            first: {
              type: GraphQLInt,
            },
          },
          resolve(data, args, context, resolveInfo) {
            const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
            const resolveData = getDataFromParsedResolveInfoFragment(
              parsedResolveInfoFragment,
              MyConnection
            );

            // For example, if this is called with (limit: 3)
            // then we'd have:
            //
            // resolveData = {
            //   limit: [
            //     3
            //   ]
            // }

            // TODO: generate and return connection
          },
        };
      }
    ),
  })
});
```

### See it for yourself

Check out a working example in `fieldData` test:

[https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build/**tests**/fieldData.test.js](https://github.com/graphile/graphile-engine/blob/master/packages/graphile-build/__tests__/fieldData.test.js)
