import type {
  __ValuePlan,
  BaseGraphQLContext,
  BaseGraphQLRootValue,
} from "graphile-crystal";
import {
  context,
  crystalEnforce,
  inputObjectSpec,
  object,
  objectSpec,
} from "graphile-crystal";
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import sql from "pg-sql2";

import type { PgClassSelectPlan, PgClassSelectSinglePlan } from "../src";
import { PgConnectionPlan, PgDataSource } from "../src";
import type {
  PgDataSourceColumn,
  PgDataSourceContext,
  WithPgClient,
} from "../src/datasource";
import type { PgConditionPlan } from "../src/plans/pgCondition";

// These are what the generics extend from

// This is the actual runtime context; we should not use a global for this.
export interface GraphileResolverContext extends BaseGraphQLContext {}

// type MessagesPlan = PgClassSelectPlan<typeof messageSource>;
type MessageConnectionPlan = PgConnectionPlan<typeof messageSource>;
type MessagePlan = PgClassSelectSinglePlan<typeof messageSource>;
// type UsersPlan = PgClassSelectPlan<typeof userSource>;
type UserPlan = PgClassSelectSinglePlan<typeof userSource>;
// type ForumsPlan = PgClassSelectPlan<typeof forumSource>;
type ForumPlan = PgClassSelectSinglePlan<typeof forumSource>;

/*+--------------------------------------------------------------------------+
  |                               DATA SOURCES                               |
  +--------------------------------------------------------------------------+*/

declare module "graphile-crystal" {
  interface BaseGraphQLContext {
    pgSettings: { [key: string]: string };
    withPgClient: WithPgClient;
  }
}

function getPgDataSourceContext() {
  const $context = context();
  return object<PgDataSourceContext<BaseGraphQLContext["pgSettings"]>>({
    pgSettings: $context.get("pgSettings"),
    withPgClient: $context.get("withPgClient"),
  });
}

/**
 * Expand this interface with your own types.
 */
export interface GraphQLTypeFromPostgresType {
  text: string;
  citext: string;
  uuid: string;
  timestamptz: string;
  int: number;
  float: number;
}

type NullableUnless<TCondition extends boolean | undefined, TType> =
  TCondition extends true ? TType : TType | null | undefined;

const col = <
  TOptions extends {
    notNull?: boolean;
    type: keyof GraphQLTypeFromPostgresType;
  },
>(
  options: TOptions,
): PgDataSourceColumn<
  NullableUnless<
    TOptions["notNull"],
    GraphQLTypeFromPostgresType[TOptions["type"]]
  >
> => {
  const { notNull, type } = options;
  return {
    gql2pg: (value) => sql`${sql.value(value as any)}::${sql.identifier(type)}`,
    pg2gql: (value) => value as any,
    notNull: !!notNull,
    type: sql.identifier(type),
  };
};

const messageSource = new PgDataSource({
  source: sql`app_public.messages`,
  name: "messages",
  context: getPgDataSourceContext,
  columns: {
    id: col({ notNull: true, type: `uuid` }),
    body: col({ notNull: true, type: `text` }),
    author_id: col({ notNull: true, type: `uuid` }),
    forum_id: col({ notNull: true, type: `uuid` }),
    created_at: col({ notNull: true, type: `timestamptz` }),
  },
  uniques: [],
});

const userSource = new PgDataSource({
  source: sql`app_public.users`,
  name: "users",
  context: getPgDataSourceContext,
  columns: {
    id: col({ notNull: true, type: `uuid` }),
    username: col({ notNull: true, type: `citext` }),
    gravatar_url: col({ type: `text` }),
    created_at: col({ notNull: true, type: `timestamptz` }),
  },
  uniques: [["id"], ["username"]],
});

const forumSource = new PgDataSource({
  source: sql`app_public.forums`,
  name: "forums",
  context: getPgDataSourceContext,
  columns: {
    id: col({ notNull: true, type: `uuid` }),
    name: col({ notNull: true, type: `citext` }),
  },
  uniques: [["id"]],
});

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
          return userSource.get({ id: $message.get("author_id") });
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

const MessageCondition = new GraphQLInputObjectType(
  inputObjectSpec({
    name: "MessageCondition",
    fields: {
      featured: {
        type: GraphQLBoolean,
        plan($condition: PgConditionPlan<typeof messageSource>, $value) {
          if ($value.evalIs(null)) {
            $condition.where(sql`${$condition.tableAlias}.featured is null`);
          } else {
            $condition.where(
              sql`${$condition.tableAlias}.featured = ${$condition.placeholder(
                $value,
              )}::boolean`,
            );
          }
        },
      },
    },
  }),
);

const Forum: GraphQLObjectType<any, GraphileResolverContext> =
  new GraphQLObjectType(
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
              plan($messages: PgClassSelectPlan<typeof messageSource>, $value) {
                $messages.setLimit($value.eval());
                return null;
              },
            },
            condition: {
              type: MessageCondition,
              plan($messages: PgClassSelectPlan<typeof messageSource>) {
                return $messages.wherePlan();
              },
            },
            includeArchived: { type: IncludeArchived },
          },
          plan($forum) {
            const $forumId = $forum.get("id");
            const $messages = messageSource.find({ forum_id: $forumId });
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
              plan(
                $connection: PgConnectionPlan<typeof messageSource>,
                $value,
              ) {
                const $messages = $connection.getSubplan();
                $messages.setLimit($value.eval());
                return null;
              },
            },
            condition: {
              type: MessageCondition,
              plan($connection: PgConnectionPlan<typeof messageSource>) {
                const $messages = $connection.getSubplan();
                return $messages.wherePlan();
              },
            },
            includeArchived: { type: IncludeArchived },
          },
          plan($forum) {
            const $messages = messageSource.find({
              forum_id: $forum.get("id"),
            });
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
  objectSpec<GraphileResolverContext, __ValuePlan<BaseGraphQLRootValue>>({
    name: "Query",
    fields: {
      forums: {
        type: new GraphQLList(Forum),
        plan(_$root) {
          const $forums = forumSource.find();
          return $forums;
        },
        args: {
          limit: {
            type: GraphQLInt,
            plan($forums: PgClassSelectPlan<typeof forumSource>, $value) {
              $forums.setLimit($value.eval());
              return null;
            },
          },
        },
      },
      allMessagesConnection: {
        type: MessagesConnection,
        args: {
          limit: {
            type: GraphQLInt,
            plan($connection: PgConnectionPlan<typeof messageSource>, $value) {
              const $messages = $connection.getSubplan();
              $messages.setLimit($value.eval());
              return null;
            },
          },
          condition: {
            type: MessageCondition,
          },
          includeArchived: { type: IncludeArchived },
        },
        plan() {
          const $messages = messageSource.find();
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

export const schema = crystalEnforce(
  new GraphQLSchema({
    query: Query,
  }),
);
