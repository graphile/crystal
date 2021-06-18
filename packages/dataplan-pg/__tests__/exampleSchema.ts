import { writeFileSync } from "fs";
import type {
  __TrackedObjectPlan,
  __ValuePlan,
  BaseGraphQLContext,
  BaseGraphQLRootValue,
  ExecutablePlan,
  InputStaticLeafPlan,
} from "graphile-crystal";
import { BasePlan } from "graphile-crystal";
import { ModifierPlan } from "graphile-crystal";
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
  printSchema,
} from "graphql";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";
import prettier from "prettier";

import type { PgClassSelectPlan } from "../src";
import {
  PgClassSelectSinglePlan,
  PgConnectionPlan,
  PgDataSource,
} from "../src";
import type {
  PgDataSourceColumn,
  PgDataSourceContext,
  WithPgClient,
} from "../src/datasource";
import type { PgConditionCapableParentPlan } from "../src/plans/pgCondition";
import { PgConditionPlan } from "../src/plans/pgCondition";

// These are what the generics extend from

// This is the actual runtime context; we should not use a global for this.
export interface GraphileResolverContext extends BaseGraphQLContext {}

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
  boolean: boolean;
}

type NullableUnless<TCondition extends boolean | undefined, TType> =
  TCondition extends true ? TType : TType | null | undefined;

export function makeExampleSchema(
  options: { deoptimize?: boolean } = {},
): GraphQLSchema {
  // type MessagesPlan = PgClassSelectPlan<typeof messageSource>;
  type MessageConnectionPlan = PgConnectionPlan<typeof messageSource>;
  type MessagePlan = PgClassSelectSinglePlan<typeof messageSource>;
  // type UsersPlan = PgClassSelectPlan<typeof userSource>;
  type UserPlan = PgClassSelectSinglePlan<typeof userSource>;
  // type ForumsPlan = PgClassSelectPlan<typeof forumSource>;
  type ForumPlan = PgClassSelectSinglePlan<typeof forumSource>;

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
      gql2pg: (value) =>
        sql`${sql.value(value as any)}::${sql.identifier(type)}`,
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
      archived_at: col({ type: "timestamptz" }),
      featured: col({ type: "boolean" }),
    },
    uniques: [["id"]],
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
      archived_at: col({ type: "timestamptz" }),
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
        featured: {
          type: GraphQLBoolean,
          plan($message) {
            return $message.get("featured");
          },
        },
        body: {
          type: GraphQLString,
          plan($message) {
            return $message.get("body");
          },
        },
        author: {
          type: User,
          plan($message) {
            const $user = userSource.get({ id: $message.get("author_id") });
            if (options.deoptimize) {
              $user.getClassPlan().setInliningForbidden();
            }

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
      EXCLUSIVELY: {
        value: "EXCLUSIVELY",
      },
    },
  });

  function makeIncludeArchivedField<TFieldPlan>(
    getClassPlan: ($fieldPlan: TFieldPlan) => PgClassSelectPlan<any>,
  ) {
    return {
      type: IncludeArchived,
      plan(
        $parent: ExecutablePlan<any>,
        $field: TFieldPlan,
        $value: InputStaticLeafPlan | __TrackedObjectPlan,
      ) {
        const $messages = getClassPlan($field);
        if ($value.evalIs("YES")) {
          // No restriction
        } else if ($value.evalIs("EXCLUSIVELY")) {
          $messages.where(sql`${$messages.alias}.archived_at is not null`);
        } else if (
          $value.evalIs("INHERIT") &&
          // INHERIT only works if the parent has an archived_at column.
          $parent instanceof PgClassSelectSinglePlan &&
          !!$parent.dataSource.columns.archived_at
        ) {
          $messages.where(
            sql`(${
              $messages.alias
            }.archived_at is null) = (${$messages.placeholder(
              $parent.get("archived_at"),
              sql`timestamptz`,
            )} is null)`,
          );
        } else {
          $messages.where(sql`${$messages.alias}.archived_at is null`);
        }
      },
      defaultValue: "INHERIT",
    };
  }

  const MessageCondition = new GraphQLInputObjectType(
    inputObjectSpec({
      name: "MessageCondition",
      fields: {
        featured: {
          type: GraphQLBoolean,
          plan($condition: PgConditionPlan<any>, $value) {
            if ($value.evalIs(null)) {
              $condition.where(sql`${$condition.alias}.featured is null`);
            } else {
              $condition.where(
                sql`${$condition.alias}.featured = ${$condition.placeholder(
                  $value,
                  sql`boolean`,
                )}`,
              );
            }
          },
        },
      },
    }),
  );

  class ClassFilterPlan extends ModifierPlan<PgConditionPlan<any>> {
    private conditions: SQL[] = [];

    constructor(parent: PgConditionPlan<any>, public readonly alias: SQL) {
      super(parent);
    }

    where(condition: SQL) {
      this.conditions.push(condition);
    }

    placeholder($plan: ExecutablePlan<any>, type: SQL): SQL {
      return this.$parent.placeholder($plan, type);
    }

    apply() {
      this.conditions.forEach((condition) => this.$parent.where(condition));
    }
  }

  class BooleanFilterPlan extends ModifierPlan<ClassFilterPlan> {
    private conditions: SQL[] = [];

    constructor(
      $classFilterPlan: ClassFilterPlan,
      public readonly expression: SQL,
    ) {
      super($classFilterPlan);
    }

    placeholder($plan: ExecutablePlan<any>, type: SQL): SQL {
      return this.$parent.placeholder($plan, type);
    }

    where(condition: SQL) {
      this.conditions.push(condition);
    }

    apply() {
      this.conditions.forEach((condition) => this.$parent.where(condition));
    }
  }

  const BooleanFilter = new GraphQLInputObjectType(
    inputObjectSpec({
      name: "BooleanFilter",
      fields: {
        equalTo: {
          type: GraphQLBoolean,
          plan($parent: BooleanFilterPlan, $value) {
            if ($value.evalIs(null)) {
              // Ignore
            } else {
              $parent.where(
                sql`${$parent.expression} = ${$parent.placeholder(
                  $value,
                  sql`boolean`,
                )}`,
              );
            }
          },
        },
        notEqualTo: {
          type: GraphQLBoolean,
          plan($parent: BooleanFilterPlan, $value) {
            if ($value.evalIs(null)) {
              // Ignore
            } else {
              $parent.where(
                sql`${$parent.expression} <> ${$parent.placeholder(
                  $value,
                  sql`boolean`,
                )}`,
              );
            }
          },
        },
      },
    }),
  );

  const MessageFilter = new GraphQLInputObjectType(
    inputObjectSpec({
      name: "MessageFilter",
      fields: {
        featured: {
          type: BooleanFilter,
          plan($messageFilter: ClassFilterPlan, $value) {
            if ($value.evalIs(null)) {
              // Ignore
            } else {
              return new BooleanFilterPlan(
                $messageFilter,
                sql`${$messageFilter.alias}.featured`,
              );
            }
          },
        },
      },
    }),
  );

  const ForumCondition = new GraphQLInputObjectType(
    inputObjectSpec({
      name: "ForumCondition",
      fields: {
        name: {
          type: GraphQLString,
          plan($condition: PgConditionPlan<any>, $value) {
            if ($value.evalIs(null)) {
              $condition.where(sql`${$condition.alias}.name is null`);
            } else {
              $condition.where(
                sql`${$condition.alias}.name = ${$condition.placeholder(
                  $value,
                  sql`text`,
                )}`,
              );
            }
          },
        },
      },
    }),
  );

  class TempTablePlan<TDataSource extends PgDataSource<any, any>>
    extends BasePlan
    implements PgConditionCapableParentPlan
  {
    public readonly alias: SQL;
    public readonly conditions: SQL[] = [];
    constructor(
      public readonly $parent: ClassFilterPlan,
      public readonly dataSource: TDataSource,
    ) {
      super();
      this.alias = sql.identifier(Symbol(`${dataSource.name}_filter`));
    }

    placeholder($plan: ExecutablePlan<any>, type: SQL): SQL {
      return this.$parent.placeholder($plan, type);
    }

    where(condition: SQL): void {
      this.conditions.push(condition);
    }
    wherePlan() {
      return new PgConditionPlan(this);
    }
  }

  class ManyFilterPlan<
    TChildDataSource extends PgDataSource<any, any>,
  > extends ModifierPlan<ClassFilterPlan> {
    public $some: TempTablePlan<TChildDataSource> | null = null;
    constructor(
      $parentFilterPlan: ClassFilterPlan,
      public childDataSource: TChildDataSource,
      private myAttrs: string[],
      private theirAttrs: string[],
    ) {
      super($parentFilterPlan);
      if (myAttrs.length !== theirAttrs.length) {
        throw new Error(
          "Expected the local and remote attributes to have the same number of entries.",
        );
      }
    }

    some() {
      const $table = new TempTablePlan(this.$parent, this.childDataSource);

      // Implement the relationship
      this.myAttrs.forEach((attr, i) => {
        $table.where(
          sql`${this.$parent.alias}.${sql.identifier(attr)} = ${
            $table.alias
          }.${sql.identifier(this.theirAttrs[i])}`,
        );
      });

      const $filter = new ClassFilterPlan($table.wherePlan(), $table.alias);
      this.$some = $table;
      return $filter;
    }

    apply() {
      if (this.$some) {
        const conditions = this.$some.conditions;
        const from = sql`\nfrom ${this.$some.dataSource.source} as ${this.$some.alias}`;
        const where =
          conditions.length === 1
            ? sql`\nwhere ${conditions[0]}`
            : conditions.length > 1
            ? sql`\nwhere\n${sql.indent(
                sql`(${sql.join(
                  conditions.map((c) => sql.indent(c)),
                  ") and (",
                )})`,
              )}`
            : sql.blank;
        this.$parent.where(
          sql`exists(${sql.indent(sql`select 1${from}${where}`)})`,
        );
      }
    }
  }

  const ForumToManyMessageFilter = new GraphQLInputObjectType(
    inputObjectSpec({
      name: "ForumToManyMessageFilter",
      fields: {
        some: {
          type: MessageFilter,
          plan($manyFilter: ManyFilterPlan<typeof messageSource>, $value) {
            if (!$value.evalIs(null)) {
              return $manyFilter.some();
            }
          },
        },
      },
    }),
  );

  const ForumFilter = new GraphQLInputObjectType(
    inputObjectSpec({
      name: "ForumFilter",
      fields: {
        messages: {
          type: ForumToManyMessageFilter,
          plan($condition: ClassFilterPlan, $value) {
            if (!$value.evalIs(null)) {
              return new ManyFilterPlan(
                $condition,
                messageSource,
                ["id"],
                ["forum_id"],
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
                plan(
                  _$forum,
                  $messages: PgClassSelectPlan<typeof messageSource>,
                  $value,
                ) {
                  $messages.setLimit($value.eval());
                  return null;
                },
              },
              condition: {
                type: MessageCondition,
                plan(
                  _$forum,
                  $messages: PgClassSelectPlan<typeof messageSource>,
                ) {
                  return $messages.wherePlan();
                },
              },
              filter: {
                type: MessageFilter,
                plan(
                  _$forum,
                  $messages: PgClassSelectPlan<typeof messageSource>,
                ) {
                  return new ClassFilterPlan(
                    $messages.wherePlan(),
                    $messages.alias,
                  );
                },
              },
              includeArchived: makeIncludeArchivedField<
                PgClassSelectPlan<typeof messageSource>
              >(($messages) => $messages),
            },
            plan($forum) {
              const $forumId = $forum.get("id");
              const $messages = messageSource.find({ forum_id: $forumId });
              if (options.deoptimize) {
                $messages.setInliningForbidden();
              }
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
                  _$forum,
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
                plan(
                  _$forum,
                  $connection: PgConnectionPlan<typeof messageSource>,
                ) {
                  const $messages = $connection.getSubplan();
                  return $messages.wherePlan();
                },
              },
              filter: {
                type: MessageFilter,
                plan(
                  _$forum,
                  $connection: PgConnectionPlan<typeof messageSource>,
                ) {
                  const $messages = $connection.getSubplan();
                  return new ClassFilterPlan(
                    $messages.wherePlan(),
                    $messages.alias,
                  );
                },
              },
              includeArchived: makeIncludeArchivedField<
                PgConnectionPlan<typeof messageSource>
              >(($connection) => $connection.getSubplan()),
            },
            plan($forum) {
              const $messages = messageSource.find({
                forum_id: $forum.get("id"),
              });
              $messages.setTrusted();
              if (options.deoptimize) {
                $messages.setInliningForbidden();
              }
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
            if (options.deoptimize) {
              $forums.setInliningForbidden();
            }
            return $forums;
          },
          args: {
            limit: {
              type: GraphQLInt,
              plan(
                _$root,
                $forums: PgClassSelectPlan<typeof forumSource>,
                $value,
              ) {
                $forums.setLimit($value.eval());
                return null;
              },
            },
            includeArchived: makeIncludeArchivedField<
              PgClassSelectPlan<typeof forumSource>
            >(($forums) => $forums),
            condition: {
              type: ForumCondition,
              plan(_$root, $forums: PgClassSelectPlan<typeof forumSource>) {
                return $forums.wherePlan();
              },
            },
            filter: {
              type: ForumFilter,
              plan(_$root, $forums: PgClassSelectPlan<typeof forumSource>) {
                return new ClassFilterPlan($forums.wherePlan(), $forums.alias);
              },
            },
          },
        },
        allMessagesConnection: {
          type: MessagesConnection,
          args: {
            limit: {
              type: GraphQLInt,
              plan(
                _$root,
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
              plan(
                _$root,
                $connection: PgConnectionPlan<typeof messageSource>,
              ) {
                const $messages = $connection.getSubplan();
                return $messages.wherePlan();
              },
            },
            filter: {
              type: MessageFilter,
              plan(
                _$root,
                $connection: PgConnectionPlan<typeof messageSource>,
              ) {
                const $messages = $connection.getSubplan();
                return new ClassFilterPlan(
                  $messages.wherePlan(),
                  $messages.alias,
                );
              },
            },
            includeArchived: makeIncludeArchivedField<
              PgConnectionPlan<typeof messageSource>
            >(($connection) => $connection.getSubplan()),
          },
          plan() {
            const $messages = messageSource.find();
            if (options.deoptimize) {
              $messages.setInliningForbidden();
            }
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

  return crystalEnforce(
    new GraphQLSchema({
      query: Query,
    }),
  );
}

export const schema = makeExampleSchema();

async function main() {
  const filePath = `${__dirname}/schema.graphql`;
  writeFileSync(
    filePath,
    prettier.format(printSchema(schema), {
      ...(await prettier.resolveConfig(filePath)),
      parser: "graphql",
    }),
  );
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
