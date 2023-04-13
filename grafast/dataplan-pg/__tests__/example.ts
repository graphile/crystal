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

import {
  __TrackedObjectStep,
  __ValueStep,
  grafastGraphql,
  isAsyncIterable,
  stripAnsi,
} from "grafast";
import type { AsyncExecutionResult, ExecutionResult } from "graphql";
import { resolve } from "path";
import { Pool } from "pg";
import prettier from "prettier";

import {
  makePgAdaptorWithPgClient,
  PgSubscriber,
} from "../dist/adaptors/pg.js";
import { makeExampleSchema } from "../dist/examples/exampleSchema.js";

const schema = makeExampleSchema();

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
    if (!matcher.global) {
      throw new Error("Expected global regex");
    }
    return string.replace(matcher, replacement);
  }
}

const testPool = new Pool({ connectionString: "graphile_grafast" });

async function main() {
  //console.log(printSchema(schema));
  function logGraphQLResult(
    result: ExecutionResult<any> | AsyncExecutionResult,
  ): void {
    const { data, errors, extensions } = result;

    const ops = (extensions?.explain as any)?.operations;
    if (ops) {
      for (const op of ops) {
        if (op.type === "mermaid-js") {
          console.log(op.diagram);
        } else {
          console.log(`UNKNOWN: ${op.type}`);
        }
      }
    }

    const nicerErrors = errors?.map((e, idx) => {
      return idx > 0
        ? e.message // Flatten all but first error
        : {
            message: stripAnsi(e.message),
            path: e.path?.join("."),
            locs: e.locations?.map((l) => `${l.line}:${l.attribute}`).join(", "),
            stack: e.stack
              ? replaceAll(
                  replaceAll(stripAnsi(e.stack), resolve(process.cwd()), "."),
                  // My vim highlighting goes wrong without the extra backslash! >‿<
                  // eslint-disable-next-line no-useless-escape
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

  async function test(source: string, variableValues = Object.create(null)) {
    const withPgClient = makePgAdaptorWithPgClient(testPool);
    const pgSubscriber = new PgSubscriber(testPool);
    const contextValue: Grafast.Context = {
      pgSettings: {},
      withPgClient,
      pgSubscriber,
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
    const result = await grafastGraphql(
      {
        schema,
        source,
        variableValues,
        contextValue,
        rootValue: null,
      },
      {
        // explain: ["mermaid-js"],
      },
    );

    console.log("GraphQL result:");
    if (isAsyncIterable(result)) {
      for await (const payload of result) {
        logGraphQLResult(payload);
        if (payload.errors) {
          throw new Error("Aborting due to errors");
        }
      }
    } else {
      logGraphQLResult(result);
      if (result.errors) {
        throw new Error("Aborting due to errors");
      }
    }
  }

  if (Math.random() > 2) {
    await test(/* GraphQL */ `
      {
        forums {
          name
        }
      }
    `);
  }

  if (Math.random() > 2) {
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

  if (Math.random() > 2) {
    await test(/* GraphQL */ `
      {
        forums {
          name
          messagesList(
            first: 5
            condition: { featured: true }
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

  if (Math.random() > 2) {
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

  if (Math.random() > 2) {
    await test(/* GraphQL */ `
      {
        forums {
          name
          messagesConnection(
            first: 5
            condition: { featured: true }
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

  if (Math.random() > 2) {
    await test(/* GraphQL */ `
      {
        forums(first: 2) {
          name
          messagesConnection(first: 2) {
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

  // interfaces-single-table/nested-more-fragments.test.graphql
  await test(/* GraphQL */ `
    {
      people {
        __typename
        username
        items: singleTableItemsList {
          __typename
          parent {
            __typename
            ...Item
          }
          ...Item
        }
      }
    }

    fragment Item on SingleTableItem {
      id
      type
      type2
      author {
        __typename
        username
      }
      position
      createdAt
      updatedAt
      isExplicitlyArchived
      archivedAt
      ... on SingleTableTopic {
        title
      }
      ... on SingleTablePost {
        title
        description
        note
      }
      ... on SingleTableDivider {
        title
        color
      }
      ... on SingleTableChecklist {
        title
      }
      ... on SingleTableChecklistItem {
        description
        note
      }
    }
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => testPool.end());
