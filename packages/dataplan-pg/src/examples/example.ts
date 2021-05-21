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

import type { __TrackedObjectPlan, __ValuePlan, Plan } from "graphile-crystal";
import { __ListItemPlan, crystalEnforce } from "graphile-crystal";
import type {
  ExecutionResult,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLObjectTypeConfig,
  Thunk,
} from "graphql";
import {
  graphql,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { resolve } from "path";
import { Pool } from "pg";
import sql from "pg-sql2";
import prettier from "prettier";

import type { PgClassSelectSinglePlan } from "..";
import { PgClassSelectPlan, PgConnectionPlan, PgDataSource } from "..";
import { stripAnsi } from "../stripAnsi";

const testPool = new Pool({ connectionString: "graphile_crystal" });

// These are what the generics extend from
export type BaseGraphQLRootValue = any;
export interface BaseGraphQLContext {}
export interface BaseGraphQLVariables {
  [key: string]: unknown;
}
export interface BaseGraphQLArguments {
  [key: string]: any;
}

// This is the actual runtime context; we should not use a global for this.
export interface GraphileResolverContext extends BaseGraphQLContext {}

/*+--------------------------------------------------------------------------+
  |                               DATA SOURCES                               |
  +--------------------------------------------------------------------------+*/

const messageSource = new PgDataSource<{
  id: string;
  body: string;
  author_id: string;
  forum_id: string;
  created_at: Date;
}>(sql`app_public.messages`, "messages", testPool);

const userSource = new PgDataSource<{
  id: string;
  username: string;
  gravatar_url?: string;
  created_at: Date;
}>(sql`app_public.users`, "users", testPool);

const forumSource = new PgDataSource<{
  id: string;
  name: string;
}>(sql`app_public.forums`, "forums", testPool);

/** TODO: permissions
 *
 * Permissions are probably part of the datasource; but how we apply them is
 * not clear. Perhaps via executeQueryWithDataSource? May need to add
 * additional where clauses/joins/etc? What does this mean for cacheability?
 * Can we do this earlier? If the data is requested through a route where
 * security is already enforced (e.g. `currentUser{postsByAuthorId{ ... }}`)
 * can we bypass adding the checks? Can the checks get merged via plan
 * optimisation? Are the security checks part of the plan itself?
 */

// Convenience so we don't have to type these out each time. These used to be
// separate plans, but required too much maintenance.
type MessagesPlan = PgClassSelectPlan<typeof messageSource>;
type MessageConnectionPlan = PgConnectionPlan<typeof messageSource>;
type MessagePlan = PgClassSelectSinglePlan<typeof messageSource>;
type UsersPlan = PgClassSelectPlan<typeof userSource>;
type UserPlan = PgClassSelectSinglePlan<typeof userSource>;
type ForumsPlan = PgClassSelectPlan<typeof forumSource>;
type ForumPlan = PgClassSelectSinglePlan<typeof forumSource>;

/*+--------------------------------------------------------------------------+
  |                            PLANS SPECS                                   |
  +--------------------------------------------------------------------------+*/

/*+--------------------------------------------------------------------------+
  |                          GRAPHQL HELPERS                                 |
  +--------------------------------------------------------------------------+*/
/**
 * Plan resolvers are like regular resolvers except they're called beforehand,
 * they return plans rather than values, and they only run once for lists
 * rather than for each item in the list.
 *
 * The idea is that the plan resolver returns a plan object which later will
 * process the data and feed that into the actual resolver functions
 * (preferably using the default resolver function?).
 *
 * They are stored onto `<field>.extensions.graphile.plan`
 *
 * @returns a plan for this field.
 *
 * @remarks
 * We're using `TrackedObject<...>` so we can later consider caching these
 * executions.
 */
export type PlanResolver<
  TContext extends BaseGraphQLContext,
  TArgs extends BaseGraphQLArguments,
  TParentPlan extends Plan<any> | null,
  TResultPlan extends Plan<any>
> = (
  $parentPlan: TParentPlan,
  args: __TrackedObjectPlan<TArgs>,
  context: __TrackedObjectPlan<TContext>,
) => TResultPlan;

/**
 * Basically GraphQLFieldConfig but with an easy to access `plan` method.
 */
type GraphileCrystalFieldConfig<
  TContext extends BaseGraphQLContext,
  TParentPlan extends Plan<any> | null,
  TResultPlan extends Plan<any>,
  TArgs extends BaseGraphQLArguments
> = GraphQLFieldConfig<any, any> & {
  plan?: PlanResolver<TContext, TArgs, TParentPlan, TResultPlan>;
};

/**
 * Saves us having to write `extensions: {graphile: {...}}` everywhere.
 */
function objectFieldSpec<
  TContext extends BaseGraphQLContext,
  TSource extends Plan<any>,
  TResult extends Plan<any> = Plan<any>,
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments
>(
  graphileSpec: GraphileCrystalFieldConfig<TContext, TSource, TResult, TArgs>,
): GraphQLFieldConfig<any, TContext, TArgs> {
  const { plan, ...spec } = graphileSpec;
  return {
    ...spec,
    extensions: {
      graphile: {
        plan,
      },
    },
  };
}

/**
 * Saves us having to write `extensions: {graphile: {...}}` everywhere.
 */
function objectSpec<
  TContext extends BaseGraphQLContext,
  TParentPlan extends Plan<any>
>(
  spec: Omit<GraphQLObjectTypeConfig<any, TContext>, "fields"> & {
    fields: Thunk<{
      [key: string]: GraphileCrystalFieldConfig<
        TContext,
        TParentPlan,
        any,
        any
      >;
    }>;
  },
): GraphQLObjectTypeConfig<any, TContext> {
  const modifiedSpec: GraphQLObjectTypeConfig<any, TContext> = {
    ...spec,
    fields: () => {
      const fields =
        typeof spec.fields === "function" ? spec.fields() : spec.fields;
      const modifiedFields = Object.keys(fields).reduce((o, key) => {
        o[key] = objectFieldSpec<TContext, TParentPlan>(fields[key]);
        return o;
      }, {} as GraphQLFieldConfigMap<any, TContext>);
      return modifiedFields;
    },
  };
  return modifiedSpec;
}

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

const User = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, UserPlan>({
    name: "User",
    fields: {
      username: {
        type: GraphQLString,
        plan($user) {
          return $user.get("username");
        },
      },
      gravatarUrl: {
        type: GraphQLString,
        plan($user) {
          return $user.get("gravatar_url");
        },
        /*
        resolve(parent) {
          return parent.gravatar_url;
        },
        extensions: {
          graphile: {
            dependencies: ["gravatar_url"],
          },
        },
        */
      },
    },
  }),
);

const Message = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, MessagePlan>({
    name: "Message",
    fields: {
      body: {
        type: GraphQLString,
        plan($message) {
          return $message.get("body");
        },
      },
      author: {
        type: User,
        plan($message) {
          const $user = new PgClassSelectPlan(
            userSource,
            [{ plan: $message.get("author_id"), type: sql`uuid` }],
            (alias) => [sql`${alias}.id`],
          ).single();
          return $user;
        },
      },
    },
  }),
);

const MessageEdge = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, MessagePlan>({
    name: "MessageEdge",
    fields: {
      cursor: {
        type: GraphQLString,
        plan($node) {
          return $node.cursor();
        },
      },
      node: {
        type: Message,
        plan($node) {
          return $node;
        },
      },
    },
  }),
);

const MessagesConnection = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, MessageConnectionPlan>({
    name: "MessagesConnection",
    fields: {
      edges: {
        type: new GraphQLList(MessageEdge),
        plan($connection) {
          return $connection.nodes();
        },
      },
      nodes: {
        type: new GraphQLList(Message),
        plan($connection) {
          return $connection.nodes();
        },
        /*
      extensions: {
        graphile: {
          plan($deps) {
            // This already contains identity information
            const plan = $deps.collection({ pagination: true, cursors: false });
            return plan;
          },
        },
      },
      */
      },
    },
  }),
);

const IncludeArchived = new GraphQLEnumType({
  name: "IncludeArchived",
  values: {
    INHERIT: {
      value: "INHERIT",
    },
    YES: {
      value: "YES",
    },
    NO: {
      value: "NO",
    },
  },
});

const MessageCondition = new GraphQLInputObjectType({
  name: "MessageCondition",
  fields: {
    active: {
      type: GraphQLBoolean,
    },
  },
});

const Forum: GraphQLObjectType<
  any,
  GraphileResolverContext
> = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, ForumPlan>({
    name: "Forum",
    fields: () => ({
      id: {
        type: GraphQLString,
        plan($forum) {
          return $forum.get("id");
        },
      },
      name: {
        type: GraphQLString,
        plan($forum) {
          return $forum.get("name");
        },
      },
      self: {
        type: Forum,
        plan($forum) {
          return $forum;
        },
      },
      messagesList: {
        type: new GraphQLList(Message),
        args: {
          limit: {
            type: GraphQLInt,
          },
          condition: {
            type: MessageCondition,
          },
          includeArchived: { type: IncludeArchived },
        },
        plan($forum) {
          const $forumId = $forum.get("id");
          const $messages = new PgClassSelectPlan(
            messageSource,
            [{ plan: $forumId, type: sql`uuid` }],
            (alias) => [sql`${alias}.forum_id`],
          );
          $messages.setTrusted();
          // $messages.leftJoin(...);
          // $messages.innerJoin(...);
          // $messages.relation('fk_messages_author_id')
          // $messages.where(...);
          // $messages.orderBy(...);
          return $messages;
        },
      },
      messagesConnection: {
        type: MessagesConnection,
        args: {
          limit: {
            type: GraphQLInt,
          },
          condition: {
            type: MessageCondition,
          },
          includeArchived: { type: IncludeArchived },
        },
        plan($forum) {
          const $messages = new PgClassSelectPlan(
            messageSource,
            [{ plan: $forum.get("id"), type: sql`uuid` }],
            (alias) => [sql`${alias}.forum_id`],
          );
          $messages.setTrusted();
          // $messages.leftJoin(...);
          // $messages.innerJoin(...);
          // $messages.relation('fk_messages_author_id')
          // $messages.where(...);
          const $connectionPlan = new PgConnectionPlan($messages);
          // $connectionPlan.orderBy... ?
          // DEFINITELY NOT $messages.orderBy BECAUSE we don't want that applied to aggregates.
          // DEFINITELY NOT $messages.limit BECAUSE we don't want those limits applied to aggregates or page info.
          return $connectionPlan;
        },
      },
    }),
  }),
);

const Query = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, __ValuePlan>({
    name: "Query",
    fields: {
      forums: {
        type: new GraphQLList(Forum),
        plan(_$root) {
          const $forums = new PgClassSelectPlan(forumSource, [], () => []);
          return $forums;
        },
      },
      allMessagesConnection: {
        type: MessagesConnection,
        args: {
          limit: {
            type: GraphQLInt,
          },
          condition: {
            type: MessageCondition,
          },
          includeArchived: { type: IncludeArchived },
        },
        plan() {
          const $messages = new PgClassSelectPlan(
            messageSource,
            [],
            (_alias) => [],
          );
          // $messages.leftJoin(...);
          // $messages.innerJoin(...);
          // $messages.relation('fk_messages_author_id')
          // $messages.where(...);
          const $connectionPlan = new PgConnectionPlan($messages);
          // $connectionPlan.orderBy... ?
          // DEFINITELY NOT $messages.orderBy BECAUSE we don't want that applied to aggregates.
          // DEFINITELY NOT $messages.limit BECAUSE we don't want those limits applied to aggregates or page info.
          return $connectionPlan;
        },
      },
    },
  }),
);

const schema = crystalEnforce(
  new GraphQLSchema({
    query: Query,
  }),
);

// Polyfill replaceAll
function regexpEscape(str: string): string {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}
declare global {
  interface String {
    replaceAll: (matcher: string | RegExp, replacement: string) => string;
  }
}
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (
    matcher: string | RegExp,
    replacement: string,
  ) {
    if (typeof matcher === "object" && matcher) {
      // TODO: need to ensure matcher is `/g`
      return this.replace(matcher, replacement);
    }
    return this.replace(new RegExp(regexpEscape(matcher), "g"), replacement);
  };
}

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
              ? stripAnsi(e.stack)
                  .replaceAll(resolve(process.cwd()), ".")
                  .replaceAll(/(?:\/[^\s\/]+)*\/node_modules\//g, "~/")
                  .split("\n")
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
      contextValue: {},
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
