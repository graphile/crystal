/* eslint-disable graphile-export/export-methods, graphile-export/export-plans */
import { lambda, makeGrafastSchema, object } from "grafast";

export const githubSchema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      user(login: String): User
    }
    type User {
      login: String
      name: String
    }
  `,
  objects: {
    Query: {
      plans: {
        user(_, { $login }) {
          return object({ login: $login });
        },
      },
    },
    User: {
      plans: {
        name($user) {
          return lambda($user, (user) => (user as any)?.login.toUpperCase());
        },
      },
    },
  },
});
