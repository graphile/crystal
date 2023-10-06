/* eslint-disable import/no-unresolved */
import PersistedPlugin from "@grafserv/persisted";
import { EXPORTABLE, exportSchema } from "graphile-export";
import { gql, makeExtendSchemaPlugin } from "graphile-utils";
import type {} from "postgraphile";
import { jsonParse } from "postgraphile/@dataplan/json";
import { makePgService } from "postgraphile/adaptors/pg";
import { context, listen, object } from "postgraphile/grafast";
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
      hooks: {
        ruruHTMLParts(_info, parts, extra) {
          parts.titleTag = `<title>${escapeHTML(
            title + " | " + extra.request.getHeader("host"),
          )}</title>`;
        },
      },
    },
  };
}

const RuruQueryParamsPlugin: GraphileConfig.Plugin = {
  name: "RuruQueryParamsPlugin",
  version: "0.0.0",

  grafserv: {
    hooks: {
      ruruHTMLParts(_info, parts, _extra) {
        parts.headerScripts += `
<script>
const currentUrl = new URL(document.URL);
const query = currentUrl.searchParams.get("query");
const variables = currentUrl.searchParams.get("variables");
if (query) {
  RURU_CONFIG.initialQuery = query;
  RURU_CONFIG.initialVariables = variables;
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

const preset: GraphileConfig.Preset = {
  plugins: [
    StreamDeferPlugin,
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
          mol() {
            return context().get("mol");
          },
        },
        Subscription: {
          // Test via SQL: `NOTIFY test, '{"a":40}';`
          sub(_$root, args) {
            const $topic = args.get("topic");
            const $pgSubscriber = context().get("pgSubscriber");
            return listen($pgSubscriber, $topic, ($payload) =>
              object({ sub: jsonParse($payload).get("a" as never) }),
            );
          },
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
    // PrimaryKeyMutationsOnlyPlugin,
    PersistedPlugin,
    makeRuruTitlePlugin("<New title text here!>"),
    ExportSchemaPlugin,
    NonNullRelationsPlugin,
    RuruQueryParamsPlugin,
  ],
  extends: [
    PostGraphileAmberPreset,
    makeV4Preset({
      simpleCollections: "both",
      jwtPgTypeIdentifier: '"b"."jwt_token"',
      dynamicJson: true,
      graphiql: true,
      graphiqlRoute: "/",
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
  },
  grafast: {
    context(requestContext, args) {
      return {
        pgSettings: {
          role: "postgres",
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
      connectionString: process.env.DATABASE_URL ?? "pggql_test",
      // List of schemas to expose:
      schemas:
        process.env.DATABASE_SCHEMAS?.split(",") ??
        (process.env.DATABASE_URL ? ["public"] : ["a", "b", "c"]),
      // Enable LISTEN/NOTIFY client
      pubsub: true,
    }),
  ],
}; /* satisfies GraphileConfig.Preset */

export default preset;
