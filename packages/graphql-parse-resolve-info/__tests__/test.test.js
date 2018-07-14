const {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} = require("../src");
const {
  graphql,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLScalarType,
  GraphQLSchema,
} = require("graphql");
const { Kind } = require("graphql/language");

const query = `
  query Test($include: Boolean!, $exclude: Boolean!) {
    allPosts {
      edges {
        cursor @include(if: $include)
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
              totalCount @include(if: $include)
              pageInfo @skip(if: $exclude) {
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
    ...MorePersonDetails @include(if: $include)
    lastName @include(if: false)
    bio @skip(if: true)
  }

  fragment MorePersonDetails on Person {
    name
    firstName
  }

  fragment PostDetails on Post {
    id
    headline
    headlineTrimmed @skip(if: $exclude)
    author: personByAuthorId {
      ...PersonDetails
    }
  }
`;

const Cursor = new GraphQLScalarType({
  name: "Cursor",
  serialize: value => String(value),
  parseValue: value => String(value),
  parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      throw new Error("Can only parse string values");
    }
    return ast.value;
  },
});

const PageInfo = new GraphQLObjectType({
  name: "PageInfo",
  fields: {
    startCursor: {
      type: Cursor,
    },
  },
});

const Person = new GraphQLObjectType({
  name: "Person",
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    bio: {
      type: GraphQLString,
    },
    firstPost: {
      type: Post,
    },
    friends: {
      type: PersonConnection,
    },
  }),
});

const PersonEdge = new GraphQLObjectType({
  name: "PersonEdge",
  fields: {
    cursor: {
      type: Cursor,
    },
    node: {
      type: Person,
    },
  },
});

const PersonConnection = new GraphQLObjectType({
  name: "PersonConnection",
  fields: {
    edges: {
      type: new GraphQLList(PersonEdge),
    },
    nodes: {
      type: new GraphQLList(Person),
    },
    pageInfo: {
      type: PageInfo,
    },
    totalCount: {
      type: GraphQLInt,
    },
  },
});

const Post = new GraphQLObjectType({
  name: "Post",
  fields: {
    personByAuthorId: {
      type: Person,
    },
    id: {
      type: GraphQLString,
    },
    headline: {
      type: GraphQLString,
    },
    headlineTrimmed: {
      type: GraphQLString,
    },
  },
});

const PostEdge = new GraphQLObjectType({
  name: "PostEdge",
  fields: {
    cursor: {
      type: Cursor,
    },
    node: {
      type: Post,
    },
  },
});

const PostsConnection = new GraphQLObjectType({
  name: "PostsConnection",
  fields: {
    edges: {
      type: new GraphQLList(PostEdge),
    },
  },
});

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
        context.test({
          parsedResolveInfoFragment,
          simplifiedFragment,
        });
        return [];
        // ...
      },
    },

    // ...
  },
});

const Schema = new GraphQLSchema({
  query: Query,
});

test("basic", async () => {
  const variables = {
    include: true,
    exclude: false,
  };
  const { parsedResolveInfoFragment, simplifiedFragment } = await new Promise(
    (resolve, reject) => {
      let o;
      graphql(
        Schema,
        query,
        null,
        {
          test: _o => (o = _o),
        },
        variables
      ).then(d => {
        try {
          const { errors } = d;
          expect(errors).toBeFalsy();
        } catch (e) {
          return reject(e);
        }
        if (o) {
          resolve(o);
        } else {
          reject(new Error("test not called?"));
        }
      }, reject);
    }
  );
  expect(parsedResolveInfoFragment).toMatchSnapshot();
  expect(simplifiedFragment).toMatchSnapshot();
});

test("directives", async () => {
  const variables = {
    include: false,
    exclude: true,
  };
  const { parsedResolveInfoFragment, simplifiedFragment } = await new Promise(
    (resolve, reject) => {
      let o;
      graphql(
        Schema,
        query,
        null,
        {
          test: _o => (o = _o),
        },
        variables
      ).then(d => {
        try {
          const { errors } = d;
          expect(errors).toBeFalsy();
        } catch (e) {
          return reject(e);
        }
        if (o) {
          resolve(o);
        } else {
          reject(new Error("test not called?"));
        }
      }, reject);
    }
  );
  expect(parsedResolveInfoFragment).toMatchSnapshot();
  expect(simplifiedFragment).toMatchSnapshot();
});
