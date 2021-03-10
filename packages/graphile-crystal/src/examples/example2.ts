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

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  graphql,
  GraphQLString,
  GraphQLObjectTypeConfig,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  ExecutionResult,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLInputObjectType,
} from "graphql";
import sql, { SQL } from "../../../pg-sql2/dist";
import { enforceCrystal } from "..";
import {
  PlanResolver,
  BaseGraphQLContext,
  BaseGraphQLArguments,
  GraphileResolverContext,
  Opaque,
  DataSource,
  CrystalContext,
  $$data,
  CrystalWrappedData,
} from "../interfaces";
import { Plan } from "../plan";

import { Pool } from "pg";
import { resolve } from "path";
import { inspect } from "util";

const isDev = process.env.NODE_ENV === "development";

const testPool = new Pool({ connectionString: "graphile_crystal" });

/*+--------------------------------------------------------------------------+
  |                               DATA SOURCES                               |
  +--------------------------------------------------------------------------+*/

/**
 * PG data source represents a PostgreSQL data source. This could be a table,
 * view, materialized view, function call, join, etc. Anything table-like.
 */
class PgDataSource<TData extends { [key: string]: any }> extends DataSource<
  { text: string; values?: any[] },
  TData
> {
  /**
   * @param tableIdentifier - the SQL for the `FROM` clause (without any
   * aliasing). If this is a subquery don't forget to wrap it in parens.
   * @param name - a nickname for this data source. Doesn't need to be unique
   * (but should be). Used for making the SQL query and debug messages easier
   * to understand.
   */
  constructor(
    public tableIdentifier: SQL,
    public name: string,
    public readonly pool: Pool = testPool,
  ) {
    super();
  }

  async execute(
    context: any,
    op: { text: string; values?: any[] },
  ): Promise<{ values: any[] }> {
    const { text, values } = op;
    let result: any, error: any;
    try {
      result = await this.pool.query({
        text,
        values,
        rowMode: "array",
      });
    } catch (e) {
      error = e;
    }
    console.log("👇".repeat(30));
    console.log(`# SQL QUERY:`);
    console.log(text);
    console.log();
    console.log(`# PLACEHOLDERS:`);
    console.log(inspect(values, { colors: true }));
    console.log();
    if (error) {
      console.log(`# ERROR:`);
      console.dir(error);
    } else {
      console.log(`# RESULT:`);
      console.log(JSON.stringify(result.rows, null, 2));
    }
    console.log("👆".repeat(30));
    if (error) {
      return Promise.reject(error);
    }
    return { values: result.rows };
  }
}

const messageSource = new PgDataSource<{
  id: string;
  body: string;
  author_id: string;
  forum_id: string;
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
type MessagePlan = PgClassSelectPlan<typeof messageSource>;
type MessageConnectionPlan = PgConnectionPlan<typeof messageSource>;
type UserPlan = PgClassSelectPlan<typeof userSource>;
type ForumPlan = PgClassSelectPlan<typeof forumSource>;

/*+--------------------------------------------------------------------------+
  |                            PLANS SPECS                                   |
  +--------------------------------------------------------------------------+*/

/*+--------------------------------------------------------------------------+
  |                          GRAPHQL HELPERS                                 |
  +--------------------------------------------------------------------------+*/

/**
 * Basically GraphQLFieldConfig but with an easy to access `plan` method.
 */
type GraphileCrystalFieldConfig<
  TContext extends BaseGraphQLContext,
  TParentPlan extends Plan<any>,
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
  spec: GraphQLObjectTypeConfig<any, TContext> & {
    fields: {
      [key: string]: GraphileCrystalFieldConfig<
        TContext,
        TParentPlan,
        any,
        any
      >;
    };
  },
): GraphQLObjectTypeConfig<any, TContext> {
  const modifiedFields = Object.keys(spec.fields).reduce((o, key) => {
    o[key] = objectFieldSpec<TContext, TParentPlan>(spec.fields[key]);
    return o;
  }, {} as GraphQLFieldConfigMap<any, TContext>);
  const modifiedSpec: GraphQLObjectTypeConfig<any, TContext> = {
    ...spec,
    fields: modifiedFields,
  };
  return modifiedSpec;
}

/**
 * Represents the root of an operation (query, mutation, subscription); is a
 * no-op.
 */
class RootPlan extends Plan<Record<string, never>> {
  eval(_context: CrystalContext, batch: CrystalWrappedData[]) {
    return batch.map(() => ({}));
  }
}

/**
 * A plan for selecting a column. Keep in mind that a column might not be a
 * scalar (could be a list, compound type, JSON, geometry, etc), so this might
 * not be a "leaf"; it might be used as the input of another layer of plan.
 */
class PgColumnSelectPlan<
  TDataSource extends PgDataSource<any>,
  TColumn extends keyof TDataSource["TData"]
> extends Plan<TDataSource["TData"][TColumn]> {
  constructor(
    public table: PgClassSelectPlan<TDataSource>,
    public attr: TColumn,
    // This is the numeric index the parent PgClassSelectPlan gave us to represent this value
    private attrIndex: number,
  ) {
    super();
  }

  eval(context: CrystalContext, values: CrystalWrappedData<any[]>[]) {
    // TODO: return `attrIndex` from the parent record. Or something.
    console.log("In PgColumnSelectPlan eval");
    console.dir(values);
    return values.map((v) => v[$$data][this.attrIndex]);
  }
}

/**
 * This represents selecting from a class-like entity (table, view, etc); i.e.
 * it represents `SELECT <columns>, <cursor?> FROM <table>`.  It's not
 * currently clear if it also includes `WHERE <conditions>`,
 * `ORDER BY <order>`, `LEFT JOIN <join>`, etc within its scope. `GROUP BY` is
 * definitely not in scope, because that would invalidate the identifiers.
 *
 * I currently don't expect this to be used to select sets of scalars, but it
 * could be used for that purpose so long as we name the scalars (i.e. create
 * records from them `{a: 1},{a: 2},{a:3}`).
 */
class PgClassSelectPlan<TDataSource extends PgDataSource<any>> extends Plan<
  TDataSource["TData"]
> {
  symbol: symbol;

  /** = sql.identifier(this.symbol) */
  alias: SQL;

  /**
   * The data source from which we are selecting: table, view, etc
   */
  dataSource: TDataSource;

  /**
   * Since this is effectively like a DataLoader it processes the data for many
   * different resolvers at once. This list of (hopefully scalar) plans is used
   * to identify which records in the result set should be returned to which
   * GraphQL resolvers.
   */
  identifiers: Array<{ plan: Plan<any>; type: SQL }>;

  /**
   * So we can clone.
   */
  identifierMatchesThunk: (alias: SQL) => SQL[];

  /**
   * This is the list of SQL fragments in the result that are compared to the
   * above `identifiers` to determine if there's a match or not. Typically this
   * will be a list of columns (e.g. primary or foreign keys on the table).
   */
  identifierMatches: SQL[];

  /**
   * If this plan has identifiers, which `select` result is associated with
   * the the index of the relevant identifier to group by.
   */
  identifierIndex: number | null;

  /**
   * If this plan has identifiers, we must feed the identifiers into the values
   * to feed into the SQL statement after compiling the query; we'll use this
   * symbol as the placeholder to replace.
   */
  identifierSymbol: symbol;

  /**
   * If true, we're expecting each identifier to have 0-n results (i.e. a
   * list).  If false, we're expecting each identifier to get one result (or
   * null).
   */
  many: boolean;

  constructor(
    dataSource: TDataSource,
    identifiers: Array<{ plan: Plan<any>; type: SQL }>,
    identifierMatchesThunk: (alias: SQL) => SQL[],
    many = false,
    cloneFrom: PgClassSelectPlan<TDataSource> | null = null,
  ) {
    super();
    this.dataSource = dataSource;
    this.identifiers = identifiers;
    this.identifierMatchesThunk = identifierMatchesThunk;
    this.many = many;

    this.colPlans = cloneFrom ? { ...cloneFrom.colPlans } : {};
    this.identifierSymbol = cloneFrom
      ? cloneFrom.identifierSymbol
      : Symbol(dataSource.name + "_identifier_values");
    this.symbol = cloneFrom ? cloneFrom.symbol : Symbol(dataSource.name);
    this.alias = cloneFrom ? cloneFrom.alias : sql.identifier(this.symbol);
    this.identifierMatches = cloneFrom
      ? cloneFrom.identifierMatches
      : identifierMatchesThunk(this.alias);
    this.joins = cloneFrom ? [...cloneFrom.joins] : [];
    this.selects = cloneFrom ? [...cloneFrom.selects] : [];
    this.identifierIndex = cloneFrom ? cloneFrom.identifierIndex : null;

    console.log(`PgClassSelectPlan(${this.dataSource.name}) constructor`);
    if (!cloneFrom) {
      if (this.identifiers.length !== this.identifierMatches.length) {
        throw new Error(
          `'identifiers' and 'identifierMatches' lengths must match (${this.identifiers.length} != ${this.identifierMatches.length})`,
        );
      }
      if (this.identifiers.length) {
        const alias = sql.identifier(Symbol(dataSource.name + "_identifiers"));
        // TODO: this should not be here; when we add toSQL support this will
        // need to be a different subquery.
        this.joins.push({
          type: "inner",
          source: sql`(select ids.ordinality - 1 as idx, ${sql.join(
            this.identifiers.map(({ type }, idx) => {
              return sql`(ids.value->>${sql.literal(
                idx,
              )})::${type} as ${sql.identifier(`id${idx}`)}`;
            }),
            ", ",
          )} from json_array_elements(${sql.value(
            // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
            // a value before executing the query.
            this.identifierSymbol as any,
          )}) with ordinality as ids)`,
          alias,
          conditions: this.identifierMatches.map(
            (frag, idx) =>
              sql`${frag} = ${alias}.${sql.identifier(`id${idx}`)}`,
          ),
        });
        this.identifierIndex = this.select(sql`${alias}.idx`);
      }
    }
    return this;
  }

  /**
   * We only want to fetch each column once (since columns don't accept any
   * parameters), so this memo keeps track of which columns we've selected so
   * their plans can be easily reused.
   */
  colPlans: {
    [key in keyof TDataSource["TData"]]?: PgColumnSelectPlan<TDataSource, key>;
  };

  /**
   * The list of things we're selecting
   */
  selects: SQL[];

  /**
   * Select an SQL fragment, returning the index the result will have.
   */
  private select(fragment: SQL): number {
    return this.selects.push(fragment) - 1;
  }

  /**
   * Returns a plan representing a named attribute (e.g. column) from the class
   * (e.g. table).
   */
  get<TAttr extends keyof TDataSource["TData"]>(
    attr: TAttr,
  ): PgColumnSelectPlan<TDataSource, TAttr> {
    // Only one plan per column
    if (!this.colPlans[attr]) {
      // TODO: where do we do the SQL conversion, e.g. to_json for dates to
      // enforce ISO8601? Perhaps this should be the datasource itself, and
      // `attr` should be an SQL expression? This would allow for computed
      // fields/etc too (admittedly those without arguments).
      const index = this.select(sql.identifier(this.symbol, String(attr)));
      this.colPlans[attr] = new PgColumnSelectPlan(this, attr, index);
    }
    return this.colPlans[attr]!;
  }

  /**
   * Not sure about this at all. When selecting a connection we need to be able
   * to get the cursor. The cursor is built from the values of the `ORDER BY`
   * clause so that we can find nodes before/after it. This may or may not be
   * the right place for this.
   */
  cursor() {
    return this.get("TODO_cursor_here");
  }

  joins: Array<
    | {
        type: "cross";
        source: SQL;
        alias: SQL;
      }
    | {
        type: "inner" | "left" | "right" | "full";
        source: SQL;
        alias: SQL;
        conditions: SQL[];
      }
  >;

  /**
   * Finalizes this instance and returns a mutable clone; useful for
   * connections/etc (e.g. copying `where` conditions but adding more, or
   * pagination, or grouping, aggregates, etc
   */
  clone(): PgClassSelectPlan<TDataSource> {
    this.finalize();
    const clone = new PgClassSelectPlan(
      this.dataSource,
      this.identifiers,
      this.identifierMatchesThunk,
      this.many,
      this,
    );
    return clone;
  }

  /**
   * `eval` will always run as a root-level query. In future we'll implement a
   * `toSQL` method that allows embedding this plan within another SQL plan...
   * But that's a problem for later.
   *
   * This runs the query for every entry in the values, and then returns an
   * array of results where each entry in the results relates to the entry in
   * the incoming values.
   *
   * NOTE: we don't know what the values being fed in are, we must feed them to
   * the plans stored in this.identifiers to get actual values we can use.
   */
  async eval(crystal: CrystalContext, values: CrystalWrappedData<unknown>[]) {
    this.finalize();

    // TODO: can some of this be moved to finalize?

    const conditions: SQL[] = [];
    const orders: SQL[] = [];
    const joins: SQL[] = this.joins.map((j) => {
      const conditions =
        j.type === "cross"
          ? []
          : j.conditions.length
          ? sql`(${sql.join(j.conditions, ") AND (")})`
          : sql.true;
      const joinCondition =
        j.type !== "cross" ? sql`\non (${conditions})` : sql.blank;
      const join: SQL =
        j.type === "inner"
          ? sql`inner join`
          : j.type === "left"
          ? sql`left outer join`
          : j.type === "right"
          ? sql`right outer join`
          : j.type === "full"
          ? sql`full outer join`
          : j.type === "cross"
          ? sql`cross join`
          : (sql.blank as never);

      return sql`${join} ${j.source} as ${j.alias}${joinCondition}`;
    });

    const fragmentsWithAliases = this.selects.map(
      (frag, idx) => sql`${frag} as ${sql.identifier(String(idx))}`,
    );
    const selection = fragmentsWithAliases.length
      ? sql`\n  ${sql.join(fragmentsWithAliases, ",\n  ")}`
      : sql` /* NOTHING?! */`;
    const select = sql`select${selection}`;
    const from = sql`\nfrom ${this.dataSource.tableIdentifier} as ${this.alias}`;
    const join = joins.length ? sql`\n${sql.join(joins, "\n")}` : sql.blank;
    const where = conditions.length
      ? sql`\nwhere (\n  ${sql.join(conditions, "\n) and (\n  ")}\n)`
      : sql.blank;
    const orderBy = orders.length
      ? sql`\norder by ${sql.join(orders, ", ")}`
      : sql.blank;
    const query = sql`${select}${from}${join}${where}${orderBy}`;

    const { text, values: rawSqlValues } = sql.compile(query);

    let sqlValues = rawSqlValues;
    const valueIndexToResultIndex: number[] = [];
    if (this.identifierIndex !== null) {
      const identifierValuesByIdentifierIndex = await Promise.all(
        this.identifiers.map(({ plan: identifierPlan }) => {
          return identifierPlan.eval(crystal, values);
        }),
      );
      let counter = -1;
      const jsonToCounter: { [key: string]: number } = {};
      for (
        let valueIndex = 0, valueCount = values.length;
        valueIndex < valueCount;
        valueIndex++
      ) {
        const identifiers = this.identifiers.map(
          (_, identifierIndex) =>
            identifierValuesByIdentifierIndex[identifierIndex][valueIndex],
        );
        const identifiersJSON = JSON.stringify(identifiers); // TODO: Canonical? Manual for perf?
        const idx = jsonToCounter[identifiersJSON];
        if (idx != null) {
          valueIndexToResultIndex[valueIndex] = idx;
        } else {
          valueIndexToResultIndex[valueIndex] = ++counter;
          jsonToCounter[identifiersJSON] = counter;
        }
      }

      sqlValues = sqlValues.map((v) => {
        // THIS IS A DELIBERATE HACK - we are replacing this symbol with a value
        // before executing the query.
        if ((v as any) === this.identifierSymbol) {
          // Manual JSON-ing
          return "[" + Object.keys(jsonToCounter).join(",") + "]";
        } else {
          return v;
        }
      });
    }

    // TODO: replace placeholder values

    const executionResult = await crystal.executeQueryWithDataSource(
      this.dataSource,
      {
        text,
        values: sqlValues,
      },
    );
    const resultValues = executionResult.values;

    if (this.identifierIndex !== null) {
      const groups = {};
      console.log(`Result values: ${inspect(resultValues, { colors: true })}`);
      for (const result of resultValues) {
        const groupKey = result[this.identifierIndex];
        if (!groups[groupKey]) {
          groups[groupKey] = [result];
        } else {
          groups[groupKey].push(result);
        }
      }
      console.log(
        `Groups (${this.identifierIndex}): ${inspect(groups, {
          colors: true,
        })}`,
      );
      const result = values.map((_, valueIdx) => {
        const idx = valueIndexToResultIndex[valueIdx];
        return this.many ? groups[idx] ?? [] : groups[idx]?.[0] ?? null;
      });
      console.log(
        `RESULTS: ${JSON.stringify(resultValues)} (many ${
          this.many ? "yes" : "no"
        })`,
      );
      return result;
    } else {
      // There's no identifiers, so everyone gets the same results.
      console.log(
        `RESULTS: ${JSON.stringify(resultValues)} (many ${
          this.many ? "yes" : "no"
        })`,
      );
      const result = this.many ? resultValues : resultValues[0];
      return values.map(() => result);
    }
  }

  /**
   * This'll turn this plan into SQL that can be embedded into a different SQL
   * plan as an optimisation. IMPORTANT: we must ensure that the datasources
   * are compatible (e.g. represent the same database) before inlining a plan.
   */
  toSQL() {}
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

class PgConnectionPlan<TDataSource extends PgDataSource<any>> extends Plan<
  unknown
> {
  constructor(public readonly subplan: PgClassSelectPlan<TDataSource>) {
    super();
  }

  nodes(): PgClassSelectPlan<TDataSource> {
    return this.subplan.clone();
  }

  eval(context: CrystalContext, values: CrystalWrappedData[]) {
    console.log(
      `PgConnectionPlan eval; values: ${inspect(values, { colors: true })}`,
    );
    // TODO
    return values.map((v) => (v[$$data]));
  }
}

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
            [{ plan: $message.get("author_id"), type: sql`uuid` }],
            (alias) => [sql`${alias}.id`],
            false, // just one
          );
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
          const $messages = new PgClassSelectPlan(
            messageSource,
            [{ plan: $forum.get("id"), type: sql`uuid` }],
            (alias) => [sql`${alias}.forum_id`],
            true, // many
          );
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
            true, // many
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

const Query = new GraphQLObjectType(
  objectSpec<GraphileResolverContext, RootPlan>({
    name: "Query",
    fields: {
      forums: {
        type: new GraphQLList(Forum),
        plan(_$root) {
          const $forums = new PgClassSelectPlan(
            forumSource,
            [],
            () => [],
            true,
          );
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
    const nicerErrors = errors?.map((e) => {
      return {
        message: e.message,
        path: e.path?.join("."),
        locs: e.locations?.map((l) => `${l.line}:${l.column}`).join(", "),
        stack: e.stack
          ?.replaceAll(resolve(process.cwd()), ".")
          .replaceAll(/(?:\/[^\s\/]+)*\/node_modules\//g, "~/")
          .split("\n"),
      };
    });
    console.log(JSON.stringify({ errors: nicerErrors, data }, null, 2));
  }

  {
    const query = /* GraphQL */ `
      {
        forums {
          name
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

    console.log("GraphQL result:");
    logGraphQLResult(result);
  }

  if (Math.random() < 2) {
    const query = /* GraphQL */ `
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
    `;

    const result = await graphql({
      schema,
      source: query,
      variableValues: {},
      contextValue: {},
      rootValue: null,
    });

    console.log("GraphQL result:");
    logGraphQLResult(result);
  }

  if (Math.random() > 2) {
    const query = /* GraphQL */ `
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

    console.log("GraphQL result:");
    logGraphQLResult(result);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => testPool.end());
