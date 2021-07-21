import { writeFileSync } from "fs";
import type {
  __TrackedObjectPlan,
  __ValuePlan,
  BaseGraphQLContext,
  BaseGraphQLRootValue,
  ExecutablePlan,
  InputStaticLeafPlan,
} from "graphile-crystal";
import {
  BasePlan,
  context,
  crystalEnforce,
  inputObjectSpec,
  ModifierPlan,
  object,
  objectSpec,
} from "graphile-crystal";
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  printSchema,
} from "graphql";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";
import prettier from "prettier";
import { inspect } from "util";

import type { PgClassSelectPlan, PgTypeCodec } from "../src";
import {
  PgClassDataSource,
  PgClassSelectSinglePlan,
  PgConnectionPlan,
} from "../src";
import type {
  PgClassDataSourceColumn,
  PgExecutorContext,
  WithPgClient,
} from "../src/datasource";
import { PgExecutor } from "../src/executor";
import { pgClassExpression } from "../src/plans/pgClassExpression";
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

  const pg2gqlForType = (
    type: "boolean" | "timestamptz" | "timestamp" | string,
  ) => {
    switch (type) {
      case "boolean": {
        return (value: any) => value === "true";
      }
      case "timestamptz":
      case "timestamp": {
        return (value: any) => new Date(Date.parse(value));
      }
      default: {
        return (value: any) => value;
      }
    }
  };

  const gql2pgForType = (type: string) => {
    switch (type) {
      default: {
        return (value: any) =>
          sql`${sql.value(value)}::${sql.identifier(type)}`;
      }
    }
  };

  function t<TCanonical = any, TInput = TCanonical>(
    type: string,
  ): PgTypeCodec<TCanonical, TInput> {
    return {
      sqlType: sql.identifier(...type.split(".")),
      fromPg: pg2gqlForType(type),
      toPg: gql2pgForType(type),
    };
  }

  const TYPES = {
    boolean: t<boolean>("boolean"),
    int: t<number>("int"),
    bigint: t<string>("bigint"),
    float: t<number>("float"),
    text: t<string>("text"),
    citext: t<string>("citext"),
    uuid: t<string>("uuid"),
    timestamptz: t<Date, Date | string>("text"),
  };

  const col = <
    TOptions extends {
      codec: PgTypeCodec;
      notNull?: boolean;
      expression?: PgClassDataSourceColumn<any>["expression"];
    },
  >(
    options: TOptions,
  ): PgClassDataSourceColumn<
    NullableUnless<TOptions["notNull"], ReturnType<TOptions["codec"]["fromPg"]>>
  > => {
    const { notNull, codec, expression } = options;
    return {
      codec,
      notNull: !!notNull,
      expression,
    };
  };

  const executor = new PgExecutor({
    name: "default",
    context: () => {
      const $context = context();
      return object<PgExecutorContext<BaseGraphQLContext["pgSettings"]>>({
        pgSettings: $context.get("pgSettings"),
        withPgClient: $context.get("withPgClient"),
      });
    },
  });

  const messageSource = new PgClassDataSource({
    source: sql`app_public.messages`,
    name: "messages",
    executor,
    columns: {
      id: col({ notNull: true, codec: TYPES.uuid }),
      body: col({ notNull: true, codec: TYPES.text }),
      author_id: col({ notNull: true, codec: TYPES.uuid }),
      forum_id: col({ notNull: true, codec: TYPES.uuid }),
      created_at: col({ notNull: true, codec: TYPES.timestamptz }),
      archived_at: col({ codec: TYPES.timestamptz }),
      featured: col({ codec: TYPES.boolean }),
      is_archived: col({
        codec: TYPES.boolean,
        expression: (alias) => sql`${alias}.archived_at is not null`,
      }),
    },
    uniques: [["id"]],
    relations: {
      author: {
        targetTable: sql`app_public.users`,
        localColumns: [`author_id`],
        remoteColumns: [`id`],
        isUnique: true,
      },
    },
  });

  const userSource = new PgClassDataSource({
    source: sql`app_public.users`,
    name: "users",
    executor,
    columns: {
      id: col({ notNull: true, codec: TYPES.uuid }),
      username: col({ notNull: true, codec: TYPES.citext }),
      gravatar_url: col({ codec: TYPES.text }),
      created_at: col({ notNull: true, codec: TYPES.timestamptz }),
    },
    uniques: [["id"], ["username"]],
  });

  const forumSource = new PgClassDataSource({
    source: sql`app_public.forums`,
    name: "forums",
    executor,
    columns: {
      id: col({ notNull: true, codec: TYPES.uuid }),
      name: col({ notNull: true, codec: TYPES.citext }),
      archived_at: col({ codec: TYPES.timestamptz }),
      is_archived: col({
        codec: TYPES.boolean,
        expression: (alias) => sql`${alias}.archived_at is not null`,
      }),
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

  const MessagesOrderBy = new GraphQLEnumType({
    name: "MessagesOrderBy",
    values: {
      BODY_ASC: {
        value: (plan: PgClassSelectPlan<typeof messageSource>) => {
          plan.orderBy({
            codec: TYPES.text,
            fragment: sql`${plan.alias}.body`,
            direction: "ASC",
          });
        },
      },
      BODY_DESC: {
        value: (plan: PgClassSelectPlan<typeof messageSource>) => {
          plan.orderBy({
            codec: TYPES.text,
            fragment: sql`${plan.alias}.body`,
            direction: "DESC",
          });
        },
      },
      AUTHOR_USERNAME_ASC: {
        value: (plan: PgClassSelectPlan<typeof messageSource>) => {
          const authorAlias = plan.singleRelation("author");
          plan.orderBy({
            codec: TYPES.text,
            fragment: sql`${authorAlias}.username`,
            direction: "ASC",
          });
        },
      },
      AUTHOR_USERNAME_DESC: {
        value: (plan: PgClassSelectPlan<typeof messageSource>) => {
          const authorAlias = plan.singleRelation("author");
          plan.orderBy({
            codec: TYPES.text,
            fragment: sql`${authorAlias}.username`,
            direction: "DESC",
          });
        },
      },
    },
  });
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
        isArchived: {
          type: GraphQLBoolean,
          plan($message) {
            return $message.get("is_archived");
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

  class TempTablePlan<TDataSource extends PgClassDataSource<any, any, any>>
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
    TChildDataSource extends PgClassDataSource<any, any, any>,
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
        const sqlConditions = sql.join(
          conditions.map((c) => sql.parens(sql.indent(c))),
          " and ",
        );
        const where =
          conditions.length === 0
            ? sql.blank
            : conditions.length === 1
            ? sql`\nwhere ${sqlConditions}`
            : sql`\nwhere\n${sql.indent(sqlConditions)}`;
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

          // Expression column
          isArchived: {
            type: GraphQLBoolean,
            plan($forum) {
              return $forum.get("is_archived");
            },
          },

          // Custom expression; actual column select shouldn't make it through to the generated query.
          archivedAtIsNotNull: {
            type: GraphQLBoolean,
            plan($forum) {
              const $archivedAt = $forum.get("archived_at");
              const $expr1 = pgClassExpression(
                $forum,
                TYPES.boolean,
              )`${$archivedAt} is not null`;
              const $expr2 = pgClassExpression(
                $forum,
                TYPES.boolean,
              )`${$expr1} is true`;
              return $expr2;
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
              first: {
                type: GraphQLInt,
                plan(
                  _$forum,
                  $messages: PgClassSelectPlan<typeof messageSource>,
                  $value,
                ) {
                  $messages.setFirst($value.eval());
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
              first: {
                type: GraphQLInt,
                plan(
                  _$forum,
                  $connection: PgConnectionPlan<typeof messageSource>,
                  $value,
                ) {
                  const $messages = $connection.getSubplan();
                  $messages.setFirst($value.eval());
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
            first: {
              type: GraphQLInt,
              plan(
                _$root,
                $forums: PgClassSelectPlan<typeof forumSource>,
                $value,
              ) {
                $forums.setFirst($value.eval());
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
            first: {
              type: GraphQLInt,
              plan(
                _$root,
                $connection: PgConnectionPlan<typeof messageSource>,
                $value,
              ) {
                const $messages = $connection.getSubplan();
                $messages.setFirst($value.eval());
                return null;
              },
            },
            last: {
              type: GraphQLInt,
              plan(
                _$root,
                $connection: PgConnectionPlan<typeof messageSource>,
                $value,
              ) {
                const $messages = $connection.getSubplan();
                $messages.setLast($value.eval());
                return null;
              },
            },
            after: {
              type: GraphQLString,
              plan(
                _$root,
                $connection: PgConnectionPlan<typeof messageSource>,
                $value,
              ) {
                const $messages = $connection.getSubplan();
                $messages.afterLock("orderBy", () => {
                  $messages.after($value.eval());
                });
                return null;
              },
            },
            before: {
              type: GraphQLString,
              plan(
                _$root,
                $connection: PgConnectionPlan<typeof messageSource>,
                $value,
              ) {
                const $messages = $connection.getSubplan();
                $messages.afterLock("orderBy", () => {
                  $messages.before($value.eval());
                });
                return null;
              },
            },
            orderBy: {
              type: new GraphQLList(new GraphQLNonNull(MessagesOrderBy)),
              plan(
                _$root,
                $connection: PgConnectionPlan<typeof messageSource>,
                $value,
              ) {
                const $messages = $connection.getSubplan();
                const val = $value.eval();
                if (!val) {
                  return null;
                }
                if (!Array.isArray(val)) {
                  throw new Error("Invalid!");
                }
                val.forEach((order) => {
                  if (typeof order !== "function") {
                    console.error(
                      `Internal server error: invalid orderBy configuration: expected function, but received ${inspect(
                        order,
                      )}`,
                    );
                    throw new Error(
                      "Internal server error: invalid orderBy configuration",
                    );
                  }
                  order($messages);
                });
                return null;
              },
            },
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
