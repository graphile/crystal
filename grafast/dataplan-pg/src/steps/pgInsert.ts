import type {
  GrafastResultsList,
  GrafastValuesList,
  SetterCapableStep,
  SetterStep,
} from "grafast";
import { ExecutableStep, exportAs, isDev, setter } from "grafast";
import type { SQL, SQLRawValue } from "pg-sql2";
import sql from "pg-sql2";

import type { PgTypeColumn } from "../codecs.js";
import { inspect } from "../inspect.js";
import type {
  GetPgResourceCodec,
  GetPgResourceColumns,
  PgCodecAny,
  PgResourceAny,
  PgTypedExecutableStep,
} from "../interfaces.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
import { pgClassExpression } from "./pgClassExpression.js";

const EMPTY_MAP = new Map<never, never>();

type QueryValueDetailsBySymbol = Map<
  symbol,
  { depId: number; processor: (value: any) => SQLRawValue }
>;

interface PgInsertPlanFinalizeResults {
  /** The SQL query text */
  text: string;

  /** The values to feed into the query */
  rawSqlValues: ReadonlyArray<SQLRawValue>;

  /** When we see the given symbol in the SQL values, what dependency do we replace it with? */
  queryValueDetailsBySymbol: QueryValueDetailsBySymbol;
}

/**
 * Inserts a row into resource with the given specified column values.
 */
export class PgInsertStep<TResource extends PgResourceAny>
  extends ExecutableStep<
    unknown[] // tuple depending on what's selected
  >
  implements
    SetterCapableStep<{
      [key in keyof GetPgResourceColumns<TResource> & string]: ExecutableStep;
    }>
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgInsertStep",
  };

  isSyncAndSafe = false;
  hasSideEffects = true;

  /**
   * Tells us what we're dealing with - data type, columns, where to insert it,
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
   * The columns and their dependency ids for us to insert.
   */
  private columns: Array<{
    name: keyof GetPgResourceColumns<TResource>;
    depId: number;
    // TODO: this shouldn't be needed, we can look it up in the codec?
    pgCodec: PgCodecAny;
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
  private finalizeResults: PgInsertPlanFinalizeResults | null = null;

  /**
   * The list of things we're selecting.
   */
  private selects: Array<SQL> = [];

  constructor(
    resource: TResource,
    columns?: {
      [key in keyof GetPgResourceColumns<TResource>]?: ExecutableStep<any>; // PgTypedExecutableStep<TColumns[key]["codec"]> |
    },
  ) {
    super();
    this.resource = resource;
    this.name = resource.name;
    this.symbol = Symbol(this.name);
    this.alias = sql.identifier(this.symbol);
    this.contextId = this.addDependency(this.resource.executor.context());
    if (columns) {
      Object.entries(columns).forEach(([key, value]) => {
        if (value) {
          this.set(
            key as keyof GetPgResourceColumns<TResource>,
            value as ExecutableStep<any>,
          );
        }
      });
    }
  }

  set<TKey extends keyof GetPgResourceColumns<TResource>>(
    name: TKey,
    value: ExecutableStep<any>, // | PgTypedExecutableStep<TColumns[TKey]["codec"]>
  ): void {
    if (this.locked) {
      throw new Error("Cannot set after plan is locked.");
    }
    if (isDev) {
      if (this.columns.some((col) => col.name === name)) {
        throw new Error(
          `Column '${String(name)}' was specified more than once in ${this}`,
        );
      }
    }
    const column = (
      this.resource.codec.columns as NonNullable<
        GetPgResourceColumns<TResource>
      >
    )?.[name];
    if (!column) {
      throw new Error(
        `Column ${String(name)} not found in ${this.resource.codec}`,
      );
    }
    const { codec: pgCodec } = column;
    const depId = this.addDependency(value);
    this.columns.push({ name, depId, pgCodec });
  }

  setPlan(): SetterStep<
    {
      [key in keyof GetPgResourceColumns<TResource> &
        string]: ExecutableStep<any>;
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
   * inserted row.
   */
  get<TAttr extends keyof GetPgResourceColumns<TResource>>(
    attr: TAttr,
  ): PgClassExpressionStep<
    GetPgResourceColumns<TResource>[TAttr] extends PgTypeColumn<infer UCodec>
      ? UCodec
      : never,
    TResource
  > {
    if (!this.resource.codec.columns) {
      throw new Error(`Cannot call .get() when there's no columns.`);
    }
    const dataSourceColumn: PgTypeColumn =
      this.resource.codec.columns[attr as string];
    if (!dataSourceColumn) {
      throw new Error(
        `${this.resource} does not define an attribute named '${String(attr)}'`,
      );
    }

    if (dataSourceColumn?.via) {
      throw new Error(`Cannot select a 'via' column from PgInsertStep`);
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

    const sqlExpr = pgClassExpression(this, dataSourceColumn.codec);
    const colPlan = dataSourceColumn.expression
      ? sqlExpr`${sql.parens(dataSourceColumn.expression(this.alias))}`
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
    return values[0].map(async (_, i) => {
      const value = values.map((v) => v[i]);
      const sqlValues = queryValueDetailsBySymbol.size
        ? rawSqlValues.map((v) => {
            if (typeof v === "symbol") {
              const details = queryValueDetailsBySymbol.get(v);
              if (!details) {
                throw new Error(`Saw unexpected symbol '${inspect(v)}'`);
              }
              const val = value[details.depId];
              return val == null ? null : details.processor(val);
            } else {
              return v;
            }
          })
        : rawSqlValues;
      const { rows } = await this.resource.executeMutation({
        context: value[this.contextId],
        text,
        values: sqlValues,
      });
      return rows[0] ?? {};
    });
  }

  public finalize(): void {
    if (!this.isFinalized) {
      this.locked = true;
      const sourceSource = this.resource.source;
      if (!sql.isSQL(sourceSource)) {
        throw new Error(
          `Error in ${this}: can only insert into sources defined as SQL, however ${
            this.resource
          } has ${inspect(this.resource.source)}`,
        );
      }
      const table = sql`${sourceSource} as ${this.alias}`;

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
       * NOTE: Though we'd like to do bulk inserts, there's no way of us
       * reliably linking the data back up again given users might:
       *
       * - rely on auto-generated primary keys
       * - have triggers manipulating the data so we can't match it back up
       *
       * Currently it seems that the order returned from `insert into ...
       * select ... order by ... returning ...` is the same order as the
       * `order by` was, however this is not guaranteed in the documentation
       * and as such cannot be relied upon. Further the pgsql-hackers list
       * explicitly declined guaranteeing this behavior:
       *
       * https://www.postgresql.org/message-id/CAKFQuwbgdJ_xNn0YHWGR0D%2Bv%2B3mHGVqJpG_Ejt96KHoJjs6DkA%40mail.gmail.com
       *
       * So we have to make do with single inserts, alas.
       */
      const columnsCount = this.columns.length;
      if (columnsCount > 0) {
        // This is our common path
        const sqlColumns: SQL[] = [];
        const valuePlaceholders: SQL[] = [];
        const queryValueDetailsBySymbol: QueryValueDetailsBySymbol = new Map();
        for (let i = 0; i < columnsCount; i++) {
          const { name, depId, pgCodec } = this.columns[i];
          sqlColumns[i] = sql.identifier(name as string);
          const symbol = Symbol(name as string);
          valuePlaceholders[i] = sql`${sql.value(
            // THIS IS A DELIBERATE HACK - we will be replacing this symbol with
            // a value before executing the query.
            symbol as any,
          )}::${pgCodec.sqlType}`;
          queryValueDetailsBySymbol.set(symbol, {
            depId,
            processor: pgCodec.toPg,
          });
        }
        const columns = sql.join(sqlColumns, ", ");
        const values = sql.join(valuePlaceholders, ", ");
        const query = sql`insert into ${table} (${columns}) values (${values})${returning};`;
        const { text, values: rawSqlValues } = sql.compile(query);

        this.finalizeResults = {
          text,
          rawSqlValues,
          queryValueDetailsBySymbol,
        };
      } else {
        // No columns to insert?! Odd... but okay.
        const query = sql`insert into ${table} default values${returning};`;
        const { text, values: rawSqlValues } = sql.compile(query);

        this.finalizeResults = {
          text,
          rawSqlValues,
          queryValueDetailsBySymbol: EMPTY_MAP,
        };
      }
    }

    super.finalize();
  }
}

/**
 * Inserts a row into resource with the given specified column values.
 */
export function pgInsert<TResource extends PgResourceAny>(
  resource: TResource,
  columns?: {
    [key in keyof GetPgResourceColumns<TResource>]?:
      | PgTypedExecutableStep<
          GetPgResourceColumns<TResource>[key] extends PgTypeColumn<
            infer UCodec,
            any
          >
            ? UCodec
            : never
        >
      | ExecutableStep<any>;
  },
): PgInsertStep<TResource> {
  return new PgInsertStep(resource, columns);
}

exportAs("@dataplan/pg", pgInsert, "pgInsert");
