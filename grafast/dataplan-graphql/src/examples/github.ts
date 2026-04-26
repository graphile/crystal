import {
  context,
  get,
  grafast,
  inhibitOnNull,
  lambda,
  LambdaStep,
  makeGrafastSchema,
  object,
  Step,
} from "grafast";

import { graphqlQuery } from "../steps/graphqlOperation";
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

function githubSchema() {
  const $client = context().get("githubClient");
  const $schema = graphqlSchema($client);
  return $schema;
}

function githubUser($login: Step) {
  const $schema = githubSchema();
  return graphqlQuery($schema).get("user", { login: $login });
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
      },
    },
    GitHubRepository: {
      name($repo: GraphQLSelectionSetStep) {
        return $repo.get("name");
      },
      issueCount($repo: GraphQLSelectionSetStep) {
        return $repo.get("issues").get("totalCount");
      },
      owner($repo: GraphQLSelectionSetStep) {
        return $repo.get("owner").ofType("User");
      },
    },
    GitHubUser: {
      username($user: GraphQLSelectionSetStep) {
        return $user.get("login");
      },
    },
  },
});

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
    },
  });
  console.dir(result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
