import sql from "pg-sql2";
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
import {
  PgDataSource,
  PgClassSelectPlan,
  PgConnectionPlan,
  PgClassSelectSinglePlan,
} from "../src";
import {
  crystalEnforce,
  context,
  object,
  objectSpec,
  __ValuePlan,
  BaseGraphQLRootValue,
} from "graphile-crystal";
import type { BaseGraphQLContext } from "graphile-crystal";
import { PgDataSourceContext, WithPgClient } from "../src/datasource";

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

const messageSource = new PgDataSource<{
  id: string;
  body: string;
  author_id: string;
  forum_id: string;
  created_at: Date;
}>(sql`app_public.messages`, "messages", getPgDataSourceContext);

const userSource = new PgDataSource<{
  id: string;
  username: string;
  gravatar_url?: string;
  created_at: Date;
}>(sql`app_public.users`, "users", getPgDataSourceContext);

const forumSource = new PgDataSource<{
  id: string;
  name: string;
}>(sql`app_public.forums`, "forums", getPgDataSourceContext);

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
  objectSpec<GraphileResolverContext, __ValuePlan<BaseGraphQLRootValue>>({
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

export const schema = crystalEnforce(
  new GraphQLSchema({
    query: Query,
  }),
);
