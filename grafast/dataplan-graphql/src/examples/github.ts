import {
  grafast,
  makeGrafastSchema,
  lambda,
  context,
  ExecutableStep,
  LambdaStep,
} from "grafast";
import { GraphQLClient, graphqlSchema } from "../steps/graphqlSchema";
import { graphqlQuery } from "../steps/graphqlOperation";
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

function githubUser($login: ExecutableStep) {
  const $schema = githubSchema();
  return graphqlQuery($schema).get("user", { login: $login });
}

type UserStep = LambdaStep<any, { id: string } | null>;

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      currentUser: User
      gitHubUserByUsername(username: String!): GitHubUser
    }
    type User {
      id: Int!
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
        const $userId = context().get("currentUserId");
        // returnIfNx($userId, null);
        // return object({ id: $userId });
        return lambda($userId, (userId) => (userId ? { id: userId } : null));
      },
      gitHubUserByUsername($username: ExecutableStep<string>) {
        return githubUser($username);
      },
    },
    User: {
      id($user: UserStep) {
        const $login = $user.get("id");
        return $login;
      },
      name($user: UserStep) {
        const $login = $user.get("id");
        return githubUser($login).get("name");
      },
      githubRepositories($user: UserStep) {
        const $login = $user.get("id");
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
  await grafast({
    schema,
    source: /* GraphQL */ `
      query Q {
        currentUser {
          ...User
        }
        gitHubUserByUsername(username: "jemgillam") {
          ...User
        }
      }
      fragment User on User {
        id
        name
        gitHubRepositories {
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
