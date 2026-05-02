/* eslint-disable graphile-export/export-methods, graphile-export/export-plans */
import {
  context,
  execute,
  get,
  grafast,
  inhibitOnNull,
  makeGrafastSchema,
  object,
  Step,
} from "grafast";
import { GraphQLError } from "graphql";

import { GraphQLClient, graphqlSchema } from "../steps/graphqlSchema";
import { GraphQLSelectionSetStep } from "../steps/graphqlSelectionSet";
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

const schema = makeGrafastSchema({
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
  plans: {
    Query: {
      currentUser(): UserStep {
        const $userId = inhibitOnNull(context().get("currentUserId"));
        return object({ id: $userId });
      },
      githubUserByUsername($username: Step<string>) {
        return githubUser($username);
      },
    },
    User: {
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
    GitHubRepository: {
      issueCount($repo: GraphQLSelectionSetStep<GitHubSchema, "query">) {
        return $repo.get("issues").get("totalCount");
        // return $repo.get("issues>totalCount");
      },
      owner($repo: GraphQLSelectionSetStep<GitHubSchema, "query">) {
        return $repo.get("owner").ofType("User");
        // return $repo.get("owner>User.")
      },
    },
    GitHubUser: {
      username($user: GraphQLSelectionSetStep<GitHubSchema, "query">) {
        return $user.get("login");
      },
    },
  },
});

const testSchema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      user(login: String): User
    }
    type User {
      login: String
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
  },
});

const githubClient: GraphQLClient = {
  async execute(args) {
    return execute({
      ...args,
      schema: testSchema,
    });
  },
};

async function main() {
  const result = await grafast({
    schema,
    source: /* GraphQL */ `
      query Q {
        currentUser {
          ...User
        }
        githubUserByUsername(username: "jemgillam") {
          username
        }
      }
      fragment User on User {
        id
        name
        githubRepositories {
          name
          issueCount
          owner {
            username
          }
        }
      }
    `,
    contextValue: {
      currentUserId: "benjie",
      githubClient,
    },
  });
  console.dir(result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
