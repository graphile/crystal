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
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  //printSchema,
  graphql,
  GraphQLString,
  GraphQLObjectTypeConfig,
  //GraphQLFieldMap,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
} from "graphql";
import {
  forumLoader,
  messageLoader,
  userLoader,
  PgConnectionPlan,
} from "./fetchers";
import sql from "../../pg-sql2/dist";
import { TrackedObject } from "../src/trackedObject";
import { enforceCrystal } from "../src";
//import { PlanResolver, GraphQLContext, GraphQLArguments } from "../src/interfaces";

// These are what the generics extend from
export type BaseGraphQLRootValue = any;
export interface BaseGraphQLContext {};
export interface BaseGraphQLVariables { [key: string]: unknown };
export interface BaseGraphQLArguments { [key: string]: unknown };

// This is the actual runtime context; we should not use a global for this.
interface GraphileResolverContext extends BaseGraphQLContext {}

type Opaque<TObj extends {[key: string]: any}> = Partial<TObj>

export type PlanResolver<
  TContext extends BaseGraphQLContext,
  TSource extends Plan<any>,
  TResult extends Plan<any>,
  TArgs extends BaseGraphQLArguments
> = (
  $parentPlan: TSource,
  args: TrackedObject<TArgs>,
  context: TrackedObject<TContext>,
) => TResult;


export abstract class Plan<TResult> {
  // @ts-ignore
  eval(): Promise<TResult> {
    /* TODO */
  };
}

type GraphileCrystalFieldConfig<
  TContext extends BaseGraphQLContext,
  TSource extends Plan<any>,
  TResult extends Plan<any> = Plan<any>,
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments
> = GraphQLFieldConfig<any, any> & {
  plan?: PlanResolver<TContext, TSource, TResult, TArgs>;
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
  graphileSpec: GraphileCrystalFieldConfig<TContext, TSource, TResult>,
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
function objectSpec<TContext extends BaseGraphQLContext, TSource extends Plan<any>>(
  spec: GraphQLObjectTypeConfig<any, TContext> & {
    fields: {
      [key: string]: GraphileCrystalFieldConfig<TContext, TSource>;
    };
  },
): GraphQLObjectTypeConfig<any, TContext> {
  const modifiedFields = Object.keys(spec.fields).reduce((o, key) => {
    o[key] = objectFieldSpec<TContext, TSource>(spec.fields[key]);
    return o;
  }, {} as GraphQLFieldConfigMap<any, TContext>);
  const modifiedSpec: GraphQLObjectTypeConfig<any, TContext> = {
    ...spec,
    fields: modifiedFields,
  };
  return modifiedSpec;
}

class PgColumnSelectPlan<TTable extends { [key: string]: any }, TColumn extends keyof TTable> extends Plan<TTable[TColumn]> {
  constructor(public attr: TColumn) {
    super();
  }
}

class PgClassSelectPlan<TTable extends { [key: string]: any }> extends Plan<Opaque<TTable>> {
  colPlans: { [key in keyof TTable]?: PgColumnSelectPlan<TTable, key> } = {};

  get(attr: keyof TTable): PgColumnSelectPlan<TTable, typeof attr> {
    // Only one plan per column
    if (!this.colPlans[attr]) {
      // TODO: add column to our selection set
      this.colPlans[attr] = new PgColumnSelectPlan<TTable, typeof attr>(attr);
    }
    return this.colPlans[attr];
  }
}

class UserPlan extends PgClassSelectPlan<{
  id: string;
  username: string;
  gravatar_url?: string;
  created_at: Date;
}> {}

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
        }
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

class MessagePlan extends PgClassSelectPlan<{
  id: string;
  body: string;
  author_id: string;
  created_at: Date;
}> {}


const Message = new GraphQLObjectType(objectSpec<GraphileResolverContext, MessagePlan>({
  name: "Message",
  fields: {
    body: {
      type: GraphQLString,
      plan($message) {
        return $message.get("body");
      }
    },
    author: {
      type: User,
      plan($message) {
        const $authorId = $message.get("author_id");
        const plan = userLoader.fetchById($authorId); //.toSQL(["author_id"]));
        return plan;
      }
      /*
      extensions: {
        graphile: {
          dependencies: ["author_id"],
          plan($deps: FutureDependencies<string>) {
            const plan = userLoader.fetchById($deps); //.toSQL(["author_id"]));
            return plan;
          },
        },
      },
      */
    },
  },
});

const MessagesConnection = new GraphQLObjectType({
  name: "MessagesConnection",
  fields: {
    nodes: {
      type: new GraphQLList(Message),
      extensions: {
        graphile: {
          plan($deps) {
            // This already contains identity information
            const plan = $deps.collection({ pagination: true, cursors: false });
            return plan;
          },
        },
      },
    },
  },
});

const Forum = new GraphQLObjectType({
  name: "Forum",
  fields: {
    name: {
      type: GraphQLString,
      extensions: {
        graphile: {
          dependencies: ["name"],
        },
      },
    },
    messagesConnection: {
      type: MessagesConnection,
      extensions: {
        graphile: {
          dependencies: ["id"],
          plan($deps) {
            const plan = messageLoader.fetchMany();
            plan.identify(
              $deps.get(["id"]),
              //$deps.toSQL(["id"]),
              (identifiers) => sql`${plan.alias}.forum_id = ${identifiers}.id`,
            );
            return new PgConnectionPlan(plan);
          },
        },
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    forums: {
      type: new GraphQLList(Forum),
      resolve: (plan) => {
        return plan.forums;
      },
      extensions: {
        graphile: {
          plan($deps) {
            const plan = forumLoader.fetchMany();
            return plan;
          },
        },
      },
    },
  },
});

const schema = enforceCrystal(
  new GraphQLSchema({
    query: Query,
  }),
);

async function main() {
  //console.log(printSchema(schema));

  const query = /* GraphQL */ `
    {
      forums {
        name
      }
    }
  `;

  const query2 = /* GraphQL */ `
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
        }
      }
    }
  `;

  const result = await graphql({
    schema,
    source: query,
    variableValues: {},
    contextValue: {},
    rootValue: null,
  });

  console.dir(result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
