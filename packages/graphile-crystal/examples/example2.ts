/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any */
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
  graphql,
  GraphQLString,
  GraphQLObjectTypeConfig,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
} from "graphql";
import sql, { SQL } from "../../pg-sql2/dist";
import { TrackedObject } from "../src/trackedObject";
import { enforceCrystal } from "../src";

// These are what the generics extend from
export type BaseGraphQLRootValue = any;
export interface BaseGraphQLContext {}
export interface BaseGraphQLVariables {
  [key: string]: unknown;
}
export interface BaseGraphQLArguments {
  [key: string]: unknown;
}

/*+--------------------------------------------------------------------------+
  |                               DATA SOURCES                               |
  +--------------------------------------------------------------------------+*/
class PgDataSource<TTable extends { [key: string]: any }> {
  TTable!: TTable; // TypeScript hack
  constructor(public tableIdentifier: SQL, public name: string) {}
}

const messageSource = new PgDataSource<{
  id: string;
  body: string;
  author_id: string;
  created_at: Date;
}>(sql`app_public.messages`, "messages");

const userSource = new PgDataSource<{
  id: string;
  username: string;
  gravatar_url?: string;
  created_at: Date;
}>(sql`app_public.users`, "users");

const forumSource = new PgDataSource<{
  id: string;
  name: string;
}>(sql`app_public.forums`, "forums");

type MessagePlan = PgClassSelectPlan<typeof userSource>;
type UserPlan = PgClassSelectPlan<typeof userSource>;
type ForumPlan = PgClassSelectPlan<typeof forumSource>;

/*+--------------------------------------------------------------------------+
  |                               STUFFS                                     |
  +--------------------------------------------------------------------------+*/

// This is the actual runtime context; we should not use a global for this.
interface GraphileResolverContext extends BaseGraphQLContext {}

type Opaque<TObj extends { [key: string]: any }> = Partial<TObj>;

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
  }
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
function objectSpec<
  TContext extends BaseGraphQLContext,
  TSource extends Plan<any>
>(
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

class PgColumnSelectPlan<
  TDataSource extends PgDataSource<any>,
  TColumn extends keyof TDataSource["TTable"]
> extends Plan<TDataSource["TTable"][TColumn]> {
  constructor(
    public table: PgClassSelectPlan<TDataSource>,
    public attr: TColumn,
  ) {
    super();
  }
}

class PgClassSelectPlan<TDataSource extends PgDataSource<any>> extends Plan<
  Opaque<TDataSource["TTable"]>
> {
  symbol: symbol;
  alias: SQL;
  identifierMatches: SQL[];

  constructor(
    public dataSource: TDataSource,
    public identifiers: Plan<any>[],
    identifierMatches: string[],
    public many = false,
  ) {
    super();
    this.symbol = Symbol(dataSource.name);
    this.alias = sql.identifier(this.symbol);
    this.identifierMatches = identifierMatches.map(
      (colName) => sql`${this.alias}.${sql.identifier(colName)}`,
    );
    if (this.identifiers.length !== this.identifierMatches.length) {
      throw new Error(
        `'identifiers' and 'identifierMatches' lengths must match (${this.identifiers.length} != ${this.identifierMatches.length})`,
      );
    }
    return this;
  }

  colPlans: {
    [key in keyof TDataSource["TTable"]]?: PgColumnSelectPlan<TDataSource, key>;
  } = {};

  get<TAttr extends keyof TDataSource["TTable"]>(
    attr: TAttr,
  ): PgColumnSelectPlan<TDataSource, TAttr> {
    // Only one plan per column
    if (!this.colPlans[attr]) {
      this.colPlans[attr] = new PgColumnSelectPlan(this, attr);
    }
    return this.colPlans[attr]!;
  }
}

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
  objectSpec<GraphileResolverContext, PgClassSelectPlan<typeof messageSource>>({
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
            [$message.get("author_id")],
            ["id"],
            false, // just one
          );
          return $user;
        },
      },
    },
  }),
);

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
  */
}

class PgEdgePlan<
  TNodePlan extends Plan<any>,
  TCursorPlan extends Plan<any>
> extends Plan<Opaque<any>> {
  constructor(
    public readonly nodePlan: TNodePlan,
    public readonly cursorPlan: TCursorPlan,
  ) {
    super();
  }
  node(): TNodePlan {
    return this.nodePlan;
  }
  cursor(): TCursorPlan {
    return this.cursorPlan;
  }
}

class PgConnectionPlan<
  TSubplan extends /* PgPlan? */ Plan<any>
> extends ConnectionPlan<TSubplan> {
  constructor(public readonly subplan: TSubplan) {
    super(subplan);
  }

  edges(): PgEdgePlan<TSubplan, Plan<any /* cursor */>> {
    // TODO: when optimising this plan we should be able to detect the children
    // are equivalent and merge them.
    return new PgEdgePlan(this.subplan, this.cursorPlan);
  }

  nodes(): TSubplan {
    return this.subplan;
  }
}

const MessageEdge = new GraphQLObjectType(
  objectSpec<
    GraphileResolverContext,
    PgEdgePlan<MessagePlan, Plan<any /* cursor */>>
  >({
    name: "MessageEdge",
    fields: {
      cursor: {
        type: GraphQLString,
        plan($edge) {
          return $edge.cursor();
        },
      },
      node: {
        type: Message,
        plan($edge) {
          return $edge.node();
        },
      },
    },
  }),
);

const MessagesConnection = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, PgConnectionPlan<MessagePlan>>({
    name: "MessagesConnection",
    fields: {
      edges: {
        type: new GraphQLList(MessageEdge),
        plan($connection) {
          return $connection.edges();
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

const Forum = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, ForumPlan>({
    name: "Forum",
    fields: {
      name: {
        type: GraphQLString,
        plan($forum) {
          return $forum.get("name");
        },
      },
      messagesConnection: {
        type: MessagesConnection,
        plan($forum) {
          const $messages = new PgClassSelectPlan(
            messageSource,
            [$forum.get("id")],
            ["forum_id"],
            true, // many
          );
          return new PgConnectionPlan($messages);
        },
      },
    },
  }),
);

class RootPlan extends Plan<unknown> {}

const Query = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, RootPlan>({
    name: "Query",
    fields: {
      forums: {
        type: new GraphQLList(Forum),
        plan() {
          const $forums = new PgClassSelectPlan(forumSource, [], [], true);
          return $forums;
        },
      },
    },
  }),
);

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

  const result2 = await graphql({
    schema,
    source: query2,
    variableValues: {},
    contextValue: {},
    rootValue: null,
  });

  console.dir(result2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
