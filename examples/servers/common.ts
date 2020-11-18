import type { Pool } from 'pg';
import { PostGraphileOptions, makePluginHook, makeExtendSchemaPlugin, gql } from '../../';
import PgPubsub from '@graphile/pg-pubsub';

// @ts-ignore `@graphile/pg-pubsub` pulls types from npm `postgraphile` module rather than local version.
const pluginHook = makePluginHook([PgPubsub]);

const MySubscriptionPlugin = makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      type TimePayload {
        currentTimestamp: String
        query: Query
      }
      extend type Subscription {
        time: TimePayload @pgSubscription(topic: "time")
      }
    `,
    resolvers: {
      Subscription: {
        time(event) {
          return event;
        },
      },
      TimePayload: {
        query() {
          return build.$$isQuery;
        },
      },
    },
  };
});

// Connection string (or pg.Pool) for PostGraphile to use
export const database: string | Pool = process.env.DATABASE_URL || 'postgraphile';

// Database schemas to use
export const schemas: string | string[] = ['public'];

// PostGraphile options; see https://www.graphile.org/postgraphile/usage-library/#api-postgraphilepgconfig-schemaname-options
export const options: PostGraphileOptions = {
  pluginHook,
  appendPlugins: [MySubscriptionPlugin],
  pgSettings(req) {
    // Adding this to ensure that all servers pass through the request in a
    // good enough way that we can extract headers.
    // CREATE FUNCTION current_user_id() RETURNS text AS $$ SELECT current_setting('graphile.test.x-user-id', TRUE); $$ LANGUAGE sql STABLE;
    return {
      'graphile.test.x-user-id':
        req.headers['x-user-id'] ||
        // `normalizedConnectionParams` comes from websocket connections, where
        // the headers often cannot be customized by the client.
        (req as any).normalizedConnectionParams?.['x-user-id'],
    };
  },
  watchPg: true,
  graphiql: true,
  enhanceGraphiql: true,
  subscriptions: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  showErrorStack: 'json',
  extendedErrors: ['hint', 'detail', 'errcode'],
  allowExplain: true,
  legacyRelations: 'omit',
  exportGqlSchemaPath: `${__dirname}/schema.graphql`,
  sortExport: true,
};

export const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
