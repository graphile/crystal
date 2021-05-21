/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
/*
 * Regular forum. Except, some forums are private.
 *
 * Forums are owned by an organization.
 *
 * Users can only see posts in a private forum if:
 * 1. they are a member of the parent organization, and
 * 2. the organization's subscription is active.
 *
 * To assert the parent organization is up to date with their subscription, we
 * check with Stripe. (Poor example, we'd normally do this with database
 * column, but shows integration of external data into query planning.)
 */

import type {
  __TrackedObjectPlan,
  __ValuePlan,
  BaseGraphQLContext,
} from "graphile-crystal";
import { __ListItemPlan } from "graphile-crystal";
import type { ExecutionResult } from "graphql";
import { graphql } from "graphql";
import { resolve } from "path";
import { Pool } from "pg";
import prettier from "prettier";

import type { WithPgClient } from "../src/datasource";
import { stripAnsi } from "../src/stripAnsi";
import { schema } from "./exampleSchema";

// Convenience so we don't have to type these out each time. These used to be
// separate plans, but required too much maintenance.
/*+--------------------------------------------------------------------------+
  |                            PLANS SPECS                                   |
  +--------------------------------------------------------------------------+*/

/*+--------------------------------------------------------------------------+
  |                          GRAPHQL HELPERS                                 |
  +--------------------------------------------------------------------------+*/

/*
class ConnectionPlan<TSubplan extends Plan<any>> extends Plan<Opaque<any>> {
  constructor(public readonly subplan: TSubplan) {
    super();
  }

  /*
  executeWith(deps: any) {
    /*
     * Connection doesn't do anything itself; so `connection { __typename }` is
     * basically a no-op. However subfields will need access to the deps so
     * that they may determine which fetched rows relate to them.
     * /
    return { ...deps };
  }
  * /
}
*/

/*+--------------------------------------------------------------------------+
  |                             THE EXAMPLE                                  |
  +--------------------------------------------------------------------------+*/

function regexpEscape(str: string): string {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}
function replaceAll(
  string: string,
  matcher: string | RegExp,
  replacement: string,
) {
  // Use native version if available.
  if (typeof String.prototype["replaceAll"] === "function") {
    return string["replaceAll"](matcher, replacement);
  }
  // Fall back to a polyfill-esque option.
  if (typeof matcher === "string") {
    return string.replace(new RegExp(regexpEscape(matcher), "g"), replacement);
  } else {
    // TODO: need to ensure matcher is `/g`
    return string.replace(matcher, replacement);
  }
}

const testPool = new Pool({ connectionString: "graphile_crystal" });

async function main() {
  //console.log(printSchema(schema));
  function logGraphQLResult(result: ExecutionResult<any>): void {
    const { data, errors } = result;
    const nicerErrors = errors?.map((e, idx) => {
      return idx > 0
        ? e.message // Flatten all but first error
        : {
            message: stripAnsi(e.message),
            path: e.path?.join("."),
            locs: e.locations?.map((l) => `${l.line}:${l.column}`).join(", "),
            stack: e.stack
              ? replaceAll(
                  replaceAll(stripAnsi(e.stack), resolve(process.cwd()), "."),
                  /(?:\/[^\s\/]+)*\/node_modules\//g,
                  "~/",
                ).split("\n")
              : e.stack,
          };
    });
    const formattedResult = {
      ...(data !== undefined ? { data } : null),
      ...(nicerErrors !== undefined ? { errors: nicerErrors } : null),
    };
    console.log(
      prettier.format(JSON.stringify(formattedResult), {
        parser: "json5",
        printWidth: 200,
      }),
    );
  }

  async function test(source: string, variableValues = {}) {
    const withPgClient: WithPgClient = async (_pgSettings, callback) => {
      const client = await testPool.connect();
      try {
        // TODO: set pgSettings within a transaction
        return callback(client);
      } finally {
        client.release();
      }
    };
    const contextValue: BaseGraphQLContext = {
      pgSettings: {},
      withPgClient,
    };
    console.log();
    console.log();
    console.log();
    console.log("=".repeat(80));
    console.log();
    console.log();
    console.log();
    console.log(prettier.format(source, { parser: "graphql" }));
    console.log();
    console.log();
    console.log();
    const result = await graphql({
      schema,
      source,
      variableValues,
      contextValue,
      rootValue: null,
    });

    console.log("GraphQL result:");
    logGraphQLResult(result);
    if (result.errors) {
      throw new Error("Aborting due to errors");
    }
  }

  if (Math.random() < 2) {
    await test(/* GraphQL */ `
      {
        forums {
          name
        }
      }
    `);
  }

  if (Math.random() < 2) {
    await test(/* GraphQL */ `
      {
        forums {
          name
          self {
            id
            name
          }
        }
      }
    `);
  }

  if (Math.random() < 2) {
    await test(/* GraphQL */ `
      {
        forums {
          name
          messagesList(
            limit: 5
            condition: { active: true }
            includeArchived: INHERIT
          ) {
            body
            author {
              username
              gravatarUrl
            }
          }
        }
      }
    `);
  }

  if (Math.random() < 2) {
    await test(/* GraphQL */ `
      {
        allMessagesConnection {
          edges {
            cursor
            node {
              body
              author {
                username
                gravatarUrl
              }
            }
          }
        }
      }
    `);
  }

  if (Math.random() < 2) {
    await test(/* GraphQL */ `
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
            edges {
              cursor
              node {
                body
                author {
                  username
                  gravatarUrl
                }
              }
            }
          }
        }
      }
    `);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => testPool.end());
