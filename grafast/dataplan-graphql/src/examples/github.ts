import {
  context,
  get,
  grafast,
  inhibitOnNull,
  makeGrafastSchema,
  object,
  Step,
} from "grafast";
import { GraphQLError } from "graphql";

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
  return $schema.query().get("user", { login: inhibitOnNull($login) });
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
      issueCount($repo: GraphQLSelectionSetStep) {
        return $repo.get("issues").get("totalCount");
        // return $repo.get("issues>totalCount");
      },
      owner($repo: GraphQLSelectionSetStep) {
        return $repo.get("owner").ofType("User");
        // return $repo.get("owner>User.")
      },
    },
    GitHubUser: {
      username($user: GraphQLSelectionSetStep) {
        return $user.get("login");
      },
    },
  },
});

const githubClient: GraphQLClient = {
  async execute(args) {
    console.dir(args);
    return { errors: [new GraphQLError("Not yet implemented")] };
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
