import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  printSchema,
  graphql,
  GraphQLString,
} from "graphql";
import {
  forumLoader,
  messageLoader,
  userLoader,
  PgConnectionPlan,
} from "./fetchers";
import sql from "../../pg-sql2/dist";

const { enforceCrystal } = require("../src");

const User = new GraphQLObjectType({
  name: "User",
  fields: {
    username: {
      type: GraphQLString,
      extensions: {
        graphile: {
          dependencies: ["username"],
        },
      },
    },
    gravatarUrl: {
      type: GraphQLString,
      resolve(parent) {
        return parent.gravatar_url;
      },
      extensions: {
        graphile: {
          dependencies: ["gravatar_url"],
        },
      },
    },
  },
});

const Message = new GraphQLObjectType({
  name: "Message",
  fields: {
    body: {
      type: GraphQLString,
      extensions: {
        graphile: {
          dependencies: ["body"],
        },
      },
    },
    author: {
      type: User,
      extensions: {
        graphile: {
          dependencies: ["author_id"],
          plan($deps) {
            const plan = userLoader.fetchById($deps.toSQL(["author_id"]));
            return plan;
          },
        },
      },
    },
  },
});

const MessagesConnection = new GraphQLObjectType({
  name: "MessagesConnection",
  fields: {
    nodes: {
      type: new GraphQLList(Message),
      extensions: {
        graphile: {
          plan($deps) {
            // This already contains identity information
            const plan = $deps.collection({ pagination: true, cursors: false });
            return plan;
          },
        },
      },
    },
  },
});

const Forum = new GraphQLObjectType({
  name: "Forum",
  fields: {
    name: {
      type: GraphQLString,
      extensions: {
        graphile: {
          dependencies: ["name"],
        },
      },
    },
    messagesConnection: {
      type: MessagesConnection,
      extensions: {
        graphile: {
          dependencies: ["id"],
          plan($deps) {
            const plan = messageLoader.fetchMany();
            plan.identify(
              $deps.get(["id"]),
              //$deps.toSQL(["id"]),
              (identifiers) => sql`${plan.alias}.forum_id = ${identifiers}.id`,
            );
            return new PgConnectionPlan(plan);
          },
        },
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    forums: {
      type: new GraphQLList(Forum),
      resolve: (plan) => {
        return plan.forums;
      },
      extensions: {
        graphile: {
          plan($deps) {
            const plan = forumLoader.fetchMany();
            return plan;
          },
        },
      },
    },
  },
});

const schema = enforceCrystal(
  new GraphQLSchema({
    query: Query,
  }),
);

async function main() {
  //console.log(printSchema(schema));

  const query = /* GraphQL */ `
    {
      forums {
        name
      }
    }
  `;

  const query2 = /* GraphQL */ `
    {
      forums {
        name
        messagesConnection(
          limit: 5
          condition: { active: true }
          includeArchived: INHERIT
        ) {
          nodes {
            body
            author {
              username
              gravatarUrl
            }
          }
        }
      }
    }
  `;

  const result = await graphql({
    schema,
    source: query,
    variableValues: {},
    contextValue: {},
    rootValue: null,
  });

  console.dir(result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
