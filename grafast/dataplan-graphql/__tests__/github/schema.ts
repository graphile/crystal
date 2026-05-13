/* eslint-disable graphile-export/export-methods, graphile-export/export-plans */
import { context, get, inhibitOnNull, object, Step } from "grafast";

import { GraphQLClient, graphqlSchema } from "../../src/steps/graphqlSchema.ts";
import { GraphQLSelectionSetStep } from "../../src/steps/graphqlSelectionSet.ts";
import { typedMakeGrafastSchema } from "./schema-generated.ts";

declare global {
  namespace Grafast {
    interface Context {
      currentUserId?: string;
      githubClient?: GraphQLClient;
    }
  }
}

type GitHubSchema = any;

function githubSchema() {
  const $client = context().get("githubClient");
  return graphqlSchema($client);
}

function githubUser($login: Step) {
  const $schema = githubSchema();
  return $schema.get("user", { login: inhibitOnNull($login) });
}

type UserStep = Step<{ id: string } | null>;

export const schema = typedMakeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      currentUser: User
      githubUserByUsername(username: String!): GitHubUser
    }
    type User {
      id: String!
      name: String
      githubRepositories: [GitHubRepository!]
    }
    type GitHubRepository {
      name: String
      issueCount: Int
      owner: GitHubUser
    }
    type GitHubUser {
      username: String!
    }
  `,
  objects: {
    Query: {
      plans: {
        currentUser(): UserStep {
          const $userId = inhibitOnNull(context().get("currentUserId"));
          return object({ id: $userId });
        },
        githubUserByUsername(_, { $username }) {
          return githubUser($username);
        },
      },
    },
    User: {
      plans: {
        id($user: UserStep) {
          const $login = get($user, "id");
          return $login;
        },
        name($user: UserStep) {
          const $login = get($user, "id");
          return githubUser($login).get("name");
        },
        githubRepositories($user: UserStep) {
          const $login = get($user, "id");
          return githubUser($login).get("repositories").get("nodes");
          // return githubUser($login).get("repositories>nodes");
        },
      },
    },
    GitHubRepository: {
      plans: {
        issueCount($repo: GraphQLSelectionSetStep<GitHubSchema, "query">) {
          return $repo.get("issues").get("totalCount");
          // return $repo.get("issues>totalCount");
        },
        owner($repo: GraphQLSelectionSetStep<GitHubSchema, "query">) {
          return $repo.get("owner").ofType("User");
          // return $repo.get("owner>User.")
        },
      },
    },
    GitHubUser: {
      plans: {
        username($user: GraphQLSelectionSetStep<GitHubSchema, "query">) {
          return $user.get("login");
        },
      },
    },
  },
});
