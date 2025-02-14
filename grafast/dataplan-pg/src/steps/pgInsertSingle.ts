import type {
  ExecutionDetails,
  GrafastResultsList,
  Maybe,
  PromiseOrDirect,
  Setter,
  SetterCapable,
} from "grafast";
import { access, ExecutableStep, exportAs, isDev, setter } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import sql, { $$toSQL } from "pg-sql2";

import type { PgCodecAttribute } from "../codecs.js";
import { sqlValueWithCodec } from "../codecs.js";
import type { PgCodecWithAttributes, PgResource } from "../index.js";
import { inspect } from "../inspect.js";
import type {
  GetPgResourceAttributes,
  GetPgResourceCodec,
  ObjectForResource,
  PgCodec,
  PgQueryBuilder,
  PgTypedExecutableStep,
  ReadonlyArrayOrDirect,
} from "../interfaces.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
import { pgClassExpression } from "./pgClassExpression.js";

interface PgInsertSinglePlanFinalizeResults {
  table: SQL;
  returning: SQL;
}

/**
 * Inserts a row into resource with the given specified attribute values.
 */
export class PgInsertSingleStep<
    TResource extends PgResource<any, any, any, any, any> = PgResource,
  >
  extends ExecutableStep<
    unknown[] // tuple depending on what's selected
  >
  implements
    SetterCapable<{
      [key in keyof GetPgResourceAttributes<TResource> &
        string]: ExecutableStep;
    }>,
    SQLable
{
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgInsertSingleStep",
  };

  isSyncAndSafe = false;

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
   * The attributes and their dependency ids for us to insert.
   */
  private attributes: Array<{
    name: keyof GetPgResourceAttributes<TResource>;
    depId: number;
    // This isn't really needed, we can look it up in the codec, but it acts as a quick reference.
    pgCodec: PgCodec;
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
  private finalizeResults: PgInsertSinglePlanFinalizeResults | null = null;

  /**
   * The list of things we're selecting.
   */
  private selects: Array<SQL> = [];

  private applyDepIds: number[] = [];

  constructor(
    resource: TResource,
    attributes?: {
      [key in keyof GetPgResourceAttributes<TResource>]?:
        | PgTypedExecutableStep<
            GetPgResourceAttributes<TResource>[key]["codec"]
          >
        | ExecutableStep;
    },
  ) {
    super();
    this.hasSideEffects = true;
    this.resource = resource;
    this.name = resource.name;
    this.symbol = Symbol(this.name);
    this.alias = sql.identifier(this.symbol);
    this.contextId = this.addDependency(this.resource.executor.context());
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        if (value) {
          this.set(
            key as keyof GetPgResourceAttributes<TResource>,
            value as ExecutableStep,
          );
        }
      });
    }
  }

  public toStringMeta(): string | null {
    return `${this.resource.name}(${this.attributes.map((a) => a.name)})`;
  }

  set<TKey extends keyof GetPgResourceAttributes<TResource>>(
    name: TKey,
    value: ExecutableStep, // | PgTypedExecutableStep<TAttributes[TKey]["codec"]>
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
    const attribute = (
      this.resource.codec.attributes as GetPgResourceAttributes<TResource>
    )?.[name];
    if (!attribute) {
      throw new Error(
        `Attribute ${String(name)} not found in ${this.resource.codec}`,
      );
    }
    const { codec: pgCodec } = attribute;
    const depId = this.addDependency(value);
    this.attributes.push({ name, depId, pgCodec });
  }

  /**
   * Returns a plan representing a named attribute (e.g. column) from the newly
   * inserted row.
   */
  get<TAttr extends keyof GetPgResourceAttributes<TResource>>(
    attr: TAttr,
  ): PgClassExpressionStep<
    GetPgResourceAttributes<TResource>[TAttr] extends PgCodecAttribute<
      infer UCodec
    >
      ? UCodec
      : never,
    TResource
  > {
    if (!this.resource.codec.attributes) {
      throw new Error(`Cannot call .get() when there's no attributes.`);
    }
    const resourceAttribute: PgCodecAttribute =
      this.resource.codec.attributes[attr as string];
    if (!resourceAttribute) {
      throw new Error(
        `${this.resource} does not define an attribute named '${String(attr)}'`,
      );
    }

    if (resourceAttribute?.via) {
      throw new Error(
        `Cannot select a 'via' attribute from PgInsertSingleStep`,
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

    const sqlExpr = pgClassExpression(
      this,
      resourceAttribute.codec,
      resourceAttribute.notNull,
    );
    const colPlan = resourceAttribute.expression
      ? sqlExpr`${sql.parens(resourceAttribute.expression(this.alias))}`
      : sqlExpr`${this.alias}.${sql.identifier(String(attr))}`;
    return colPlan as any;
  }

  public getMeta(key: string) {
    return access(this, ["meta", key]);
  }

  public record(): PgClassExpressionStep<
    GetPgResourceCodec<TResource>,
    TResource
  > {
    return pgClassExpression<GetPgResourceCodec<TResource>, TResource>(
      this,
      this.resource.codec as GetPgResourceCodec<TResource>,
      false,
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

  apply(
    $step: ExecutableStep<
      ReadonlyArrayOrDirect<Maybe<PgInsertSingleQueryBuilderCallback>>
    >,
  ) {
    this.applyDepIds.push(this.addUnaryDependency($step));
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
  async execute({
    indexMap,
    values,
  }: ExecutionDetails): Promise<GrafastResultsList<any>> {
    if (!this.finalizeResults) {
      throw new Error("Cannot execute PgSelectStep before finalizing it.");
    }
    const { resource, contextId, finalizeResults, alias } = this;
    const { table, returning } = finalizeResults;
    const contextDep = values[contextId];

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
    // We must execute each mutation on its own, but we can at least do so in
    // parallel. Note we return a list of promises, each may reject or resolve
    // without causing the others to reject.
    return indexMap<PromiseOrDirect<any>>(async (i) => {
      const context = contextDep.at(i);

      const sqlAttributes: SQL[] = [];
      const sqlValues: SQL[] = [];
      for (const { depId, name, pgCodec } of this.attributes) {
        const attVal = values[depId].at(i);
        // `null` is kept, `undefined` is skipped
        if (attVal !== undefined) {
          const sqlIdent = sql.identifier(name as string);
          const sqlVal = sqlValueWithCodec(attVal, pgCodec);
          sqlAttributes.push(sqlIdent);
          sqlValues.push(sqlVal);
        }
      }

      const meta = Object.create(null);
      const queryBuilder: PgInsertSingleQueryBuilder = {
        alias,
        [$$toSQL]() {
          return alias;
        },
        set(name, attVal) {
          const pgCodec = resource.codec.attributes[name]?.codec;
          if (!pgCodec) {
            throw new Error(`Attribute ${name} not recognized on ${resource}`);
          }
          const sqlIdent = sql.identifier(name as string);
          const sqlVal = sqlValueWithCodec(attVal, pgCodec);
          sqlAttributes.push(sqlIdent);
          sqlValues.push(sqlVal);
        },
        setBuilder() {
          return setter(this);
        },
        setMeta(key, value) {
          meta[key] = value;
        },
      };

      for (const applyDepId of this.applyDepIds) {
        const val = values[applyDepId].unaryValue();
        if (Array.isArray(val)) {
          val.forEach((v) => v?.(queryBuilder));
        } else {
          val?.(queryBuilder);
        }
      }

      let compileResult: ReturnType<typeof sql.compile>;
      if (sqlAttributes.length > 0) {
        // This is our common path
        const attributes = sql.join(sqlAttributes, ", ");
        const values = sql.join(sqlValues, ", ");
        const query = sql`insert into ${table} (${attributes}) values (${values})${returning};`;
        compileResult = sql.compile(query);
      } else {
        // No columns to insert?! Odd... but okay.
        const query = sql`insert into ${table} default values${returning};`;
        compileResult = sql.compile(query);
      }

      const { text, values: stmtValues } = compileResult;
      const { rows } = await this.resource.executeMutation({
        context,
        text,
        values: stmtValues,
      });
      return { __proto__: null, m: meta, t: rows[0] };
    });
  }

  public finalize(): void {
    if (!this.isFinalized) {
      this.locked = true;
      const resourceSource = this.resource.from;
      if (!sql.isSQL(resourceSource)) {
        throw new Error(
          `Error in ${this}: can only insert into sources defined as SQL, however ${
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
      this.finalizeResults = {
        table,
        returning,
      };
    }

    super.finalize();
  }
  [$$toSQL]() {
    return this.alias;
  }
}

/**
 * Inserts a row into resource with the given specified attribute values.
 */
export function pgInsertSingle<
  TResource extends PgResource<any, any, any, any, any>,
>(
  resource: TResource,
  attributes?: {
    [key in keyof GetPgResourceAttributes<TResource>]?:
      | PgTypedExecutableStep<GetPgResourceAttributes<TResource>[key]["codec"]>
      | ExecutableStep;
  },
): PgInsertSingleStep<TResource> {
  return new PgInsertSingleStep(resource, attributes);
}
exportAs("@dataplan/pg", pgInsertSingle, "pgInsertSingle");

export interface PgInsertSingleQueryBuilder<
  TResource extends PgResource<
    any,
    PgCodecWithAttributes,
    any,
    any,
    any
  > = PgResource<any, PgCodecWithAttributes, any, any, any>,
> extends PgQueryBuilder,
    SetterCapable<ObjectForResource<TResource>> {
  set<TAttributeName extends keyof ObjectForResource<TResource>>(
    key: TAttributeName,
    value: ObjectForResource<TResource>[TAttributeName],
  ): void;
  setBuilder(): Setter<ObjectForResource<TResource>, this>;
  setMeta(key: string, value: any): void;
}

type PgInsertSingleQueryBuilderCallback = (
  qb: PgInsertSingleQueryBuilder,
) => void;
