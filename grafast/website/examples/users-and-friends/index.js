const DataLoader = require("dataloader");
const { buildSchema, printSchema, graphql } = require("graphql");
const { makeGrafastSchema, context, each, grafastGraphql } = require("grafast");
const {
  getUsersByIds,
  getFriendshipsByUserIds,
} = require("./businessLogic.js");

const typeDefs = /* GraphQL */ `
  type Query {
    currentUser: User
  }
  type User {
    name: String!
    friends: [User]!
  }
`;
const makeContextValue = () => ({
  currentUserId: 1,
  userLoader: new DataLoader((ids) => getUsersByIds(ids)),
  friendshipsByUserIdLoader: new DataLoader((userIds) =>
    getFriendshipsByUserIds(userIds),
  ),
});
const resolvers = {
  Query: {
    async currentUser(_, args, context) {
      return context.userLoader.load(context.currentUserId);
    },
  },
  User: {
    name(user) {
      return user.full_name;
    },
    async friends(user, args, context) {
      const friendships = await context.friendshipsByUserIdLoader.load(user.id);
      const friends = await Promise.all(
        friendships.map((friendship) =>
          context.userLoader.load(friendship.friend_id),
        ),
      );
      return friends;
    },
  },
};

const User = {
  get($id) {
    return;
  },
};

const planResolvers = {
  Query: {
    currentUser() {
      return User.get(context().get("currentUserId"));
    },
  },
  User: {
    name($user) {
      return $user.get("full_name");
    },
    friends($user) {
      const $friendships = Friendship.allByUserId($user.get("id"));
      return each($friendships, ($friendship) =>
        User.get($friendship.get("friendId")),
      );
    },
  },
};

const makeGraphQLSchema = () => {
  const schema = buildSchema(typeDefs);
  // Mutating a schema after it's generated is a Bad Idea. Don't do this in your own code.
  for (const [typeName, fieldResolvers] of Object.entries(resolvers)) {
    const type = schema.getType(typeName);
    const fields = type.getFields();
    for (const [fieldName, resolver] of Object.entries(fieldResolvers)) {
      const field = fields[fieldName];
      field.resolve = resolver;
    }
  }
  return schema;
};

const graphqlSchema = makeGraphQLSchema();
const grafastSchema = makeGrafastSchema({
  typeDefs,
  plans: planResolvers,
  enableDeferStream: false,
});
// console.log(printSchema(graphqlSchema));
// console.log(printSchema(grafastSchema));

const source = /* GraphQL */ `
  {
    currentUser {
      name
      friends {
        name
        friends {
          name
        }
      }
    }
  }
`;

async function main() {
  const graphqlResult = await graphql({
    schema: graphqlSchema,
    source,
    contextValue: makeContextValue(),
  });
  console.dir(graphqlResult, { depth: Infinity });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
