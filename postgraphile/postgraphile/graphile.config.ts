/* eslint-disable import/no-unresolved */
import type { PgSelectSingleStep } from "@dataplan/pg";
import { TYPES } from "@dataplan/pg";
import PersistedPlugin from "@grafserv/persisted";
import { EXPORTABLE, exportSchema } from "graphile-export";
import {
  gql,
  makeExtendSchemaPlugin,
  makeWrapPlansPlugin,
} from "graphile-utils";
import * as jsonwebtoken from "jsonwebtoken";
import type {} from "postgraphile";
import { jsonParse } from "postgraphile/@dataplan/json";
import { makePgService } from "postgraphile/adaptors/pg";
import type { EdgeStep, ObjectStep } from "postgraphile/grafast";
import {
  connection,
  constant,
  context,
  error,
  lambda,
  listen,
  object,
} from "postgraphile/grafast";
import { defaultMaskError } from "postgraphile/grafserv";
import type {} from "postgraphile/grafserv/node";
import { defaultHTMLParts } from "postgraphile/grafserv/ruru/server";
import { StreamDeferPlugin } from "postgraphile/graphile-build";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { PgLazyJWTPreset } from "postgraphile/presets/lazy-jwt";
import { PgRelayPreset } from "postgraphile/presets/relay";
import { makeV4Preset } from "postgraphile/presets/v4";

// import { PgManyToManyPreset } from "../../contrib/pg-many-to-many/dist/index.js";
// import { PostGraphileConnectionFilterPreset } from "../../contrib/postgraphile-plugin-connection-filter/dist/index.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

declare global {
  namespace Grafast {
    interface Context {
      mol?: number;
    }
  }
}

/*
const PrimaryKeyMutationsOnlyPlugin: GraphileConfig.Plugin = {
  name: "PrimaryKeyMutationsOnlyPlugin",
  version: "0.0.0",

  gather: {
    hooks: {
      pgIntrospection_introspection(info, event) {
        const { introspection } = event;
        for (const pgConstraint of introspection.constraints) {
          if (pgConstraint.contype === "u") {
            const tags = pgConstraint.getTags();
            const newBehavior = ["-update", "-delete"];
            if (typeof tags.behavior === "string") {
              newBehavior.push(tags.behavior);
            } else if (Array.isArray(tags.behavior)) {
              newBehavior.push(...tags.behavior);
            }
            tags.behavior = newBehavior;
            console.log(pgConstraint.getClass().relname, newBehavior);
          }
        }
      },
    },
  },
};
*/

const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function escapeHTML(rawText: string): string {
  return rawText.replace(
    /[&<>"']/g,
    (l) => HTML_ESCAPES[l as keyof typeof HTML_ESCAPES],
  );
}

function makeRuruTitlePlugin(title: string): GraphileConfig.Plugin {
  return {
    name: "RuruTitlePlugin",
    version: "0.0.0",

    grafserv: {
      middleware: {
        ruruHTMLParts(next, event) {
          const { htmlParts, request } = event;
          htmlParts.titleTag = `<title>${escapeHTML(
            title + " | " + request.getHeader("host"),
          )}</title>`;
          return next();
        },
      },
    },
  };
}

const RuruQueryParamsPlugin: GraphileConfig.Plugin = {
  name: "RuruQueryParamsPlugin",
  version: "0.0.0",

  grafserv: {
    middleware: {
      ruruHTMLParts(next, event) {
        const { htmlParts } = event;
        htmlParts.headerScripts += `
<script>
{
  const currentUrl = new URL(document.URL);
  const query = currentUrl.searchParams.get("query");
  const variables = currentUrl.searchParams.get("variables");
  if (query) {
    RURU_CONFIG.query = query;
    RURU_CONFIG.variables = variables;
  }
}
</script>
`;
        return next();
      },
    },
  },
};

/**
 * Update the URL search params with the current query and variables
 */
const RuruQueryParamsUpdatePlugin: GraphileConfig.Plugin = {
  name: "RuruQueryParamsUpdatePlugin",
  version: "0.0.0",

  grafserv: {
    middleware: {
      ruruHTMLParts(next, event) {
        const { htmlParts } = event;
        htmlParts.headerScripts += `
<script>
{
  const currentUrl = new URL(document.URL);
  RURU_CONFIG.onEditQuery = (query) => {
    currentUrl.searchParams.set("query", query);
    window.history.replaceState(null, "", currentUrl);
  };
  RURU_CONFIG.onEditVariables = (variables) => {
    currentUrl.searchParams.set("variables", variables);
    window.history.replaceState(null, "", currentUrl);
  };
}
</script>
`;
      },
    },
  },
};

const ExportSchemaPlugin: GraphileConfig.Plugin = {
  name: "ExportSchemaPlugin",
  version: "0.0.0",

  schema: {
    hooks: {
      finalize(schema) {
        exportSchema(schema, `${__dirname}/exported-schema.mjs`, {
          mode: "typeDefs",
          modules: {
            jsonwebtoken,
          },
        }).catch((e) => {
          console.error(e);
        });
        return schema;
      },
    },
  },
};

const NonNullRelationsPlugin: GraphileConfig.Plugin = {
  name: "NonNullRelationsPlugin",
  description:
    "Makes foreign key fields non-nullable if their columns are all `not null`",
  version: "0.0.0",

  schema: {
    hooks: {
      // Hook a field that has already been defined
      GraphQLObjectType_fields_field(field, build, context) {
        const {
          graphql: { GraphQLNonNull, getNullableType },
          input: { pgRegistry },
        } = build;
        // Extract details about why this field was defined.
        const { isPgSingleRelationField, pgRelationDetails } = context.scope;
        // See if the field was defined for a singular relation
        if (isPgSingleRelationField && pgRelationDetails) {
          // If so, extract details about the relation
          const { codec, relationName } = pgRelationDetails;
          // Look up the relation in the registry
          const relation = pgRegistry.pgRelations[codec.name][relationName];
          // Determine if every column is non-null
          const everyColumnIsNonNull = relation.localAttributes.every(
            (attrName) => codec.attributes[attrName].notNull,
          );
          if (!relation.isReferencee && everyColumnIsNonNull) {
            // If so, change the type of the field to be non-nullable
            field.type = new GraphQLNonNull(getNullableType(field.type));
          }
        }
        return field;
      },
    },
  },
};

const LeftArmPlugin = makeExtendSchemaPlugin((build) => {
  const { left_arm } = build.input.pgRegistry.pgResources;
  return {
    typeDefs: gql`
      extend type Person {
        allArms: PersonRelatedArmConnection
      }
      type PersonRelatedArmConnection {
        edges: [PersonRelatedArmEdge]
      }
      type PersonRelatedArmEdge {
        node: LeftArm
        isTheirs: Boolean
      }
    `,
    plans: {
      Person: {
        allArms: EXPORTABLE(
          (connection, left_arm, object) => ($person) => {
            const $arms = left_arm.find();

            return connection($arms, {
              edgeDataPlan($arm) {
                return object({ arm: $arm, person: $person });
              },
            });
          },
          [connection, left_arm, object],
        ),
      },
      PersonRelatedArmEdge: {
        isTheirs: EXPORTABLE(
          (aEqualsB, lambda) =>
            (
              $edge: EdgeStep<
                any,
                any,
                any,
                ObjectStep<{
                  arm: PgSelectSingleStep;
                  person: PgSelectSingleStep;
                }>,
                any
              >,
            ) => {
              const $obj = $edge.data();
              const $arm = $obj.get("arm");
              const $armPersonId = $arm.get("person_id");
              const $person = $obj.get("person");
              const $personId = $person.get("id");
              return lambda([$personId, $armPersonId], aEqualsB);
            },
          [aEqualsB, lambda],
        ),
      },
    },
  };
});

const preset: GraphileConfig.Preset = {
  plugins: [
    StreamDeferPlugin,
    makeExtendSchemaPlugin((build) => {
      const { sql } = build;
      return {
        typeDefs: gql`
          extend type Person {
            greet(
              greeting: String! = "Hello" @deprecated(reason: "TESTING")
            ): String
            query: Query
          }
          extend type Query {
            throw: Int
            wrapMe: Int
          }
        `,
        plans: {
          Query: {
            wrapMe: EXPORTABLE((constant) => () => constant(42), [constant]),
            throw: EXPORTABLE(
              (error) => () => {
                return error(
                  new Error(
                    "You've requested the 'throw' field... which throws!",
                  ),
                );
              },
              [error],
            ),
          },
          Person: {
            greet: EXPORTABLE(
              (TYPES, sql) =>
                ($user: PgSelectSingleStep, { $greeting }) => {
                  const placeholderSql = $user.placeholder(
                    $greeting,
                    TYPES.text,
                  );
                  return $user.select(
                    sql`${placeholderSql} || ', ' || ${$user}.name`,
                    TYPES.text,
                  );
                },
              [TYPES, sql],
            ),
            query: EXPORTABLE(
              (constant) => () => {
                return constant(true);
              },
              [constant],
            ),
          },
        },
      };
    }),
    makeWrapPlansPlugin({
      Query: {
        wrapMe(plan) {
          return plan();
        },
      },
      Mutation: {
        updatePost(plan) {
          return plan();
        },
      },
    }),
    makeExtendSchemaPlugin({
      typeDefs: gql`
        extend type Query {
          mol: Int
        }
        extend type Subscription {
          sub(topic: String!): Int
          gql: Int
        }
      `,
      plans: {
        Query: {
          mol: EXPORTABLE(
            (context) => () => {
              return context().get("mol");
            },
            [context],
          ),
        },
        Subscription: {
          // Test via SQL: `NOTIFY test, '{"a":40}';`
          sub: EXPORTABLE(
            (context, jsonParse, listen, object) => (_$root, args) => {
              const $topic = args.get("topic");
              const $pgSubscriber = context().get("pgSubscriber");
              return listen($pgSubscriber, $topic, ($payload) =>
                object({ sub: jsonParse($payload).get("a" as never) }),
              );
            },
            [context, jsonParse, listen, object],
          ),
          gql: {
            resolve: EXPORTABLE(
              () =>
                function resolve(e) {
                  return e;
                },
              [],
            ),
            subscribe: EXPORTABLE(
              (sleep) =>
                async function* subscribe() {
                  for (let i = 0; i < 10; i++) {
                    yield i;
                    await sleep(300);
                  }
                },
              [sleep],
            ),
          },
        },
      },
    }),
    makeExtendSchemaPlugin({
      typeDefs: gql`
        extend type Subscription {
          error: Int
        }
      `,
      plans: {
        Subscription: {
          error: {
            subscribePlan: EXPORTABLE(
              (constant, lambda) =>
                function subscribePlan() {
                  return lambda(constant(3), () => {
                    throw new Error("Testing error");
                  });
                },
              [constant, lambda],
            ),
          },
        },
      },
    }),
    // PrimaryKeyMutationsOnlyPlugin,
    PersistedPlugin,
    makeRuruTitlePlugin("<New title text here!>"),
    ExportSchemaPlugin,
    NonNullRelationsPlugin,
    RuruQueryParamsPlugin,
    RuruQueryParamsUpdatePlugin,
    ...(Math.random() > 2 ? [LeftArmPlugin] : []),
  ],
  extends: [
    PostGraphileAmberPreset,
    makeV4Preset({
      simpleCollections: "both",
      jwtPgTypeIdentifier: '"b"."jwt_token"',
      dynamicJson: true,
      graphiql: true,
      graphiqlRoute: "/",
      ignoreRBAC: false,
      simpleSubscriptions: true,
    }),
    // PgManyToManyPreset,
    // PostGraphileConnectionFilterPreset,
    PgRelayPreset,
    PgLazyJWTPreset,
  ],
  ruru: {
    htmlParts: {
      metaTags: defaultHTMLParts.metaTags + "<!-- HELLO WORLD! -->",
    },
  },
  inflection: {},
  gather: {
    pgJwtTypes: "b.jwt_token",
  },
  schema: {
    retryOnInitFail: true,
    exportSchemaSDLPath: `${__dirname}/latestSchema.graphql`,
    exportSchemaIntrospectionResultPath: `${__dirname}/latestSchema.json`,
    sortExport: true,
    pgJwtSecret: "FROGS",
  },
  grafserv: {
    port: 5678,
    graphqlPath: "/graphql",
    websockets: true,
    graphqlOverGET: true,
    persistedOperationsDirectory: `${process.cwd()}/.persisted_operations`,
    allowUnpersistedOperation: true,
    maskError(error) {
      const masked = defaultMaskError(error);
      const stack = error.originalError?.stack;
      if (typeof stack === "string") {
        masked.extensions.stack = stack.split(/\n/);
      }
      return masked;
    },
  },
  grafast: {
    context(requestContext, args) {
      return {
        pgSettings: {
          // role: "postgres",
          ...args.contextValue?.pgSettings,
        },
        mol: 42,
      };
    },
    explain: true,
  },
  pgServices: [
    makePgService({
      // Database connection string:
      connectionString: process.env.DATABASE_URL ?? "postgres:///pggql_test",
      // List of schemas to expose:
      schemas:
        process.env.DATABASE_SCHEMAS?.split(",") ??
        (process.env.DATABASE_URL ? ["public"] : ["a", "b", "c"]),
      // Enable LISTEN/NOTIFY client
      pubsub: true,
    }),
  ],
}; /* satisfies GraphileConfig.Preset */

function aEqualsB([a, b]: readonly [a: any, b: any]) {
  return a === b;
}
export default preset;
