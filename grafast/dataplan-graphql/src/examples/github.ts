import {
  grafast,
  makeGrafastSchema,
  lambda,
  context,
  ExecutableStep,
} from "grafast";
import { GraphQLClient, graphqlSchema } from "../steps/graphqlSchema";
import { graphqlQuery } from "..";

declare global {
  namespace Grafast {
    interface Context {
      githubClient?: GraphQLClient;
    }
  }
}

function githubSchema() {
  const $client = context().get("githubClient");
  const $schema = graphqlSchema($client);
  return $schema;
}

function githubUser($id: ExecutableStep) {
  const $schema = githubSchema();
  return graphqlQuery($schema).get("user", { login: $id });
}

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
      currentUser() {
        const $userId = context().get("currentUserId");
        // returnIfNx($userId, null);
        // return object({ id: $userId });
        return lambda($userId, (userId) => (userId ? { id: userId } : null));
      },
      gitHubUserByUsername($username) {
        return githubUser($username);
      },
    },
    User: {
      id($user) {
        const $userId = $user.get("id");
        return $userId;
      },
      name($user) {
        const $userId = $user.get("id");
        return githubUser($userId).get("name");
      },
      githubRepositories() {
        const $userId = $user.get("id");
        return githubUser($userId).get("repositories").get("nodes");
      },
    },
    GitHubRepository: {
      name($repo) {
        return $repo.get("name");
      },
      issueCount($repo) {
        return $repo.get("issues").get("totalCount");
      },
      owner($repo) {
        return $repo.get("owner").ofType("User");
      },
    },
    GitHubUser: {
      username($user) {
        return $user.get("login");
      },
    },
  },
});

async function main() {
  await grafast({
    schema,
    source: /* GraphQL */ `
      {
        currentUser {
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
      }
    `,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
