import type {
  GrafastResultsList,
  GrafastValuesList,
  SetterStep,
} from "grafast";
import { ExecutableStep, exportAs, isDev, SafeError, setter } from "grafast";
import type { SQL, SQLRawValue } from "pg-sql2";
import sql from "pg-sql2";

import type { _AnyPgCodecAttribute, PgCodecAttributeName } from "../codecs.js";
import type { GenericPgResource, PgResourceUnique } from "../index.js";
import { inspect } from "../inspect.js";
import type {
  _AnyPgCodec,
  GetPgResourceAttributes,
  GetPgResourceCodec,
  GetPgResourceUniques,
  PlanByUniques,
} from "../interfaces.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
import { pgClassExpression } from "./pgClassExpression.js";
import { _AnyPgResource, PgResourceUniques } from "../datasource.js";

type QueryValueDetailsBySymbol = Map<
  symbol,
  { depId: number; processor: (value: any) => SQLRawValue }
>;

interface PgUpdatePlanFinalizeResults {
  /** The SQL query text */
  text: string;

  /** The values to feed into the query */
  rawSqlValues: ReadonlyArray<SQLRawValue>;

  /** When we see the given symbol in the SQL values, what dependency do we replace it with? */
  queryValueDetailsBySymbol: QueryValueDetailsBySymbol;
}
/** @internal */
export interface _AnyPgUpdateSingleStep extends PgUpdateSingleStep<any> {}
export interface GenericPgUpdateSingleStep
  extends PgUpdateSingleStep<GenericPgResource> {}
/**
 * Update a single row identified by the 'getBy' argument.
 */
export class PgUpdateSingleStep<
  TResource extends _AnyPgResource,
> extends ExecutableStep<unknown[]> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgUpdateSingleStep",
  };
  isSyncAndSafe = false;

  hasSideEffects = true;

  /**
   * Tells us what we're dealing with - data type, columns, where to update it,
   * what it's called, etc.
   */
  public readonly resource: TResource;

  /**
   * This defaults to the name of the resource but you can override it. Aids
   * in debugging.
   */
  private readonly name: string;

  /**
   * To be used as the table alias, we always use a symbol unless the calling
   * code specifically indicates a string to use.
   */
  private readonly symbol: symbol | string;

  /** = sql.identifier(this.symbol) */
  public readonly alias: SQL;

  /**
   * The attributes and their dependency ids for us to find the record by.
   */
  private getBys: Array<{
    name: PgCodecAttributeName<GetPgResourceAttributes<TResource>>;
    depId: number;
    pgCodec: _AnyPgCodec;
  }> = [];

  /**
   * The attributes and their dependency ids for us to update.
   */
  private attributes: Array<{
    name: PgCodecAttributeName<GetPgResourceAttributes<TResource>>;
    depId: number;
    pgCodec: _AnyPgCodec;
  }> = [];

  /**
   * The id for the PostgreSQL context plan.
   */
  private contextId: number;

  /**
   * When locked, no more values can be set, no more selects can be added
   */
  private locked = false;

  /**
   * When finalized, we build the SQL query, queryValues, and note where to feed in
   * the relevant queryValues. This saves repeating this work at execution time.
   */
  private finalizeResults: PgUpdatePlanFinalizeResults | null = null;

  /**
   * The list of things we're selecting.
   */
  private selects: Array<SQL> = [];

  constructor(
    resource: TResource,
    getBy: PlanByUniques<
      GetPgResourceAttributes<TResource>,
      PgResourceUniques<TResource>
    >,
    attributes?: {
      [attribute in GetPgResourceAttributes<TResource> as PgCodecAttributeName<attribute>]?: ExecutableStep; // | PgTypedExecutableStep<TAttributes[key]["codec"]>
    },
  ) {
    super();
    this.resource = resource;
    this.name = resource.name;
    this.symbol = Symbol(this.name);
    this.alias = sql.identifier(this.symbol);
    this.contextId = this.addDependency(this.resource.executor.context());

    const keys = getBy
      ? (Object.keys(getBy) as Array<
          PgCodecAttributeName<GetPgResourceAttributes<TResource>>
        >)
      : [];

    if (
      !(
        this.resource.uniques as Array<
          PgResourceUnique<GetPgResourceAttributes<TResource>>
        >
      ).some((uniq) => uniq.attributes.every((key) => keys.includes(key)))
    ) {
      throw new Error(
        `Attempted to build 'PgUpdateSingleStep' with a non-unique getBy keys ('${keys.join(
          "', '",
        )}') - please ensure your 'getBy' spec uniquely identifiers a row (resource = ${
          this.resource
        }; supported uniques = ${inspect(this.resource.uniques)}).`,
      );
    }

    keys.forEach((name) => {
      if (isDev) {
        if (this.getBys.some((col) => col.name === name)) {
          throw new Error(
            `Attribute '${String(
              name,
            )}' was specified more than once in ${this}'s getBy spec`,
          );
        }
      }
      const value = getBy[name];
      const depId = this.addDependency(value);
      const attribute = this.resource.codec.attributes?.[name];
      if (attribute) {
        const pgCodec = attribute.codec;
        this.getBys.push({ name, depId, pgCodec });
      }
    });

    if (attributes) {
      (
        Object.entries(attributes) as Array<
          [
            PgCodecAttributeName<GetPgResourceAttributes<TResource>>,
            ExecutableStep,
          ]
        >
      ).forEach(([key, value]) => {
        if (value) {
          this.set(key, value as ExecutableStep);
        }
      });
    }
  }

  public toStringMeta(): string | null {
    return `${this.resource.name}(${this.getBys.map(
      (g) => g.name,
    )};${this.attributes.map((a) => a.name)})`;
  }

  set<TKey extends PgCodecAttributeName<GetPgResourceAttributes<TResource>>>(
    name: TKey,
    value: ExecutableStep, // PgTypedExecutableStep<GetPgResourceAttributes<TResource>[number]["codec"]>,
  ): void {
    if (this.locked) {
      throw new Error("Cannot set after plan is locked.");
    }
    if (isDev) {
      if (this.attributes.some((col) => col.name === name)) {
        throw new Error(
          `Attribute '${String(name)}' was specified more than once in ${this}`,
        );
      }
    }
    const attribute = this.resource.codec.attributes?.[name];
    if (attribute) {
      const depId = this.addDependency(value);
      this.attributes.push({ name, depId, pgCodec: attribute.codec });
    }
  }

  setPlan(): SetterStep<
    {
      [attribute in GetPgResourceAttributes<TResource> as PgCodecAttributeName<attribute>]: ExecutableStep;
    },
    this
  > {
    if (this.locked) {
      throw new Error(
        `${this}: cannot set values once plan is locked ('setPlan')`,
      );
    }
    return setter(this);
  }

  /**
   * Returns a plan representing a named attribute (e.g. column) from the newly
   * updateed row.
   */
  get<TAttr extends PgCodecAttributeName<GetPgResourceAttributes<TResource>>>(
    attr: TAttr,
  ): PgClassExpressionStep<
    Extract<GetPgResourceAttributes<TResource>, { name: TAttr }>["codec"],
    TResource
  > {
    const resourceAttribute: _AnyPgCodecAttribute =
      this.resource.codec.attributes![attr as string];
    if (!resourceAttribute) {
      throw new Error(
        `${this.resource} does not define an attribute named '${String(attr)}'`,
      );
    }

    if (resourceAttribute?.via) {
      throw new Error(
        `Cannot select a 'via' attribute from PgUpdateSingleStep`,
      );
    }

    /*
     * Only cast to `::text` during select; we want to use it uncasted in
     * conditions/etc. The reasons we cast to ::text include:
     *
     * - to make return values consistent whether they're direct or in nested
     *   arrays
     * - to make sure that that various PostgreSQL clients we support do not
     *   mangle the data in unexpected ways - we take responsibility for
     *   decoding these string values.
     */

    const sqlExpr = pgClassExpression(this, resourceAttribute.codec);
    const colPlan = resourceAttribute.expression
      ? sqlExpr`${sql.parens(resourceAttribute.expression(this.alias))}`
      : sqlExpr`${this.alias}.${sql.identifier(String(attr))}`;
    return colPlan as any;
  }

  public record(): PgClassExpressionStep<
    GetPgResourceCodec<TResource>,
    TResource
  > {
    return pgClassExpression<GetPgResourceCodec<TResource>, TResource>(
      this,
      this.resource.codec as GetPgResourceCodec<TResource>,
    )`${this.alias}`;
  }

  /**
   * Advanced method; rather than returning a plan it returns an index.
   * Generally useful for PgClassExpressionStep.
   *
   * @internal
   */
  public selectAndReturnIndex(fragment: SQL): number {
    // NOTE: it's okay to add selections after the plan is "locked" - lock only
    // applies to which rows are being selected, not what is being queried
    // about the rows.

    // Optimisation: if we're already selecting this fragment, return the existing one.
    const index = this.selects.findIndex((frag) =>
      sql.isEquivalent(frag, fragment),
    );
    if (index >= 0) {
      return index;
    }

    return this.selects.push(fragment) - 1;
  }

  /**
   * `execute` will always run as a root-level query. In future we'll implement a
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
  async execute(
    _count: number,
    values: Array<GrafastValuesList<any>>,
  ): Promise<GrafastResultsList<any>> {
    if (!this.finalizeResults) {
      throw new Error("Cannot execute PgSelectStep before finalizing it.");
    }
    const { text, rawSqlValues, queryValueDetailsBySymbol } =
      this.finalizeResults;

    // We must execute each mutation on its own, but we can at least do so in
    // parallel. Note we return a list of promises, each may reject or resolve
    // without causing the others to reject.
    return values[this.contextId].map(async (context, i) => {
      const sqlValues = queryValueDetailsBySymbol.size
        ? rawSqlValues.map((v) => {
            if (typeof v === "symbol") {
              const details = queryValueDetailsBySymbol.get(v);
              if (!details) {
                throw new Error(`Saw unexpected symbol '${inspect(v)}'`);
              }
              const val = values[details.depId][i];
              return val == null ? null : details.processor(val);
            } else {
              return v;
            }
          })
        : rawSqlValues;
      const { rows, rowCount } = await this.resource.executeMutation({
        context,
        text,
        values: sqlValues,
      });
      return rows[0] ?? (rowCount === 0 ? null : Object.create(null));
    });
  }

  public finalize(): void {
    if (!this.isFinalized) {
      this.locked = true;
      const resourceSource = this.resource.from;
      if (!sql.isSQL(resourceSource)) {
        throw new Error(
          `Error in ${this}: can only update into resources defined as SQL, however ${
            this.resource
          } has ${inspect(this.resource.from)}`,
        );
      }
      const table = sql`${resourceSource} as ${this.alias}`;

      const fragmentsWithAliases = this.selects.map(
        (frag, idx) => sql`${frag} as ${sql.identifier(String(idx))}`,
      );
      const returning =
        fragmentsWithAliases.length > 0
          ? sql` returning\n${sql.indent(
              sql.join(fragmentsWithAliases, ",\n"),
            )}`
          : sql.blank;

      /*
       * NOTE: Though we'd like to do bulk updates, there's no way of us
       * reliably linking the data back up again given users might have
       * triggers manipulating the data so we can't match it back up even using
       * the same getBy specs.
       *
       * Currently it seems that the order returned from `update ...
       * from (select ... order by ...) returning ...` is the same order as the
       * `order by` was, however this is not guaranteed in the documentation
       * and as such cannot be relied upon. Further the pgsql-hackers list
       * explicitly declined guaranteeing this behavior:
       *
       * https://www.postgresql.org/message-id/CAKFQuwbgdJ_xNn0YHWGR0D%2Bv%2B3mHGVqJpG_Ejt96KHoJjs6DkA%40mail.gmail.com
       *
       * So we have to make do with single updates, alas.
       */
      const getByAttributesCount = this.getBys.length;
      const attributesCount = this.attributes.length;
      if (attributesCount === 0) {
        // No attributes to update?! This isn't allowed.
        throw new SafeError(
          "Attempted to update a record, but no new values were specified.",
        );
      } else if (getByAttributesCount === 0) {
        // No attributes specified to find the row?! This is forbidden.
        throw new SafeError(
          "Attempted to update a record, but no information on uniquely determining the record was specified.",
        );
      } else {
        // This is our common path
        const sqlWhereClauses: SQL[] = [];
        const sqlSets: SQL[] = [];
        const queryValueDetailsBySymbol: QueryValueDetailsBySymbol = new Map();

        for (let i = 0; i < getByAttributesCount; i++) {
          const { name, depId, pgCodec } = this.getBys[i];
          const symbol = Symbol(name as string);
          sqlWhereClauses[i] = sql.parens(
            sql`${sql.identifier(this.symbol, name as string)} = ${sql.value(
              // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
              // a value before executing the query.
              symbol as any,
            )}::${pgCodec.sqlType}`,
          );
          queryValueDetailsBySymbol.set(symbol, {
            depId,
            processor: pgCodec.toPg,
          });
        }

        for (let i = 0; i < attributesCount; i++) {
          const { name, depId, pgCodec } = this.attributes[i];
          const symbol = Symbol(name as string);
          sqlSets[i] = sql`${sql.identifier(name as string)} = ${sql.value(
            // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
            // a value before executing the query.
            symbol as any,
          )}::${pgCodec.sqlType}`;
          queryValueDetailsBySymbol.set(symbol, {
            depId,
            processor: pgCodec.toPg,
          });
        }

        const set = sql` set ${sql.join(sqlSets, ", ")}`;
        const where = sql` where ${sql.parens(
          sql.join(sqlWhereClauses, " and "),
        )}`;
        const query = sql`update ${table}${set}${where}${returning};`;
        const { text, values: rawSqlValues } = sql.compile(query);

        this.finalizeResults = {
          text,
          rawSqlValues,
          queryValueDetailsBySymbol,
        };
      }
    }

    super.finalize();
  }
}

/**
 * Update a single row identified by the 'getBy' argument.
 */
export function pgUpdateSingle<TResource extends _AnyPgResource>(
  resource: TResource,
  getBy: PlanByUniques<
    GetPgResourceAttributes<TResource>,
    GetPgResourceUniques<TResource>
  >,
  attributes?: {
    [attribute in GetPgResourceAttributes<TResource> as PgCodecAttributeName<attribute>]?: ExecutableStep; // | PgTypedExecutableStep<TAttributes[key]["codec"]>
  },
): PgUpdateSingleStep<TResource> {
  return new PgUpdateSingleStep(resource, getBy, attributes);
}

exportAs("@dataplan/pg", pgUpdateSingle, "pgUpdateSingle");
