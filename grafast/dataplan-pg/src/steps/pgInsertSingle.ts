import type {
  ExecutionDetails,
  GrafastResultsList,
  Maybe,
  Multistep,
  PromiseOrDirect,
  Setter,
  SetterCapable,
  Thunk,
} from "grafast";
import { access, exportAs, inspect, multistep, setter, Step } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import sql, { $$toSQL } from "pg-sql2";

import type { PgCodecAttribute, PgCodecJSDatatype } from "../codecs.ts";
import { sqlValueWithCodec } from "../codecs.ts";
import type { PgResource } from "../datasource.ts";
import type {
  GetPgResourceAttributes,
  GetPgResourceCodec,
  ObjectForResource,
  PgCodec,
  PgCodecAttributeNullability,
  PgCodecWithAttributes,
  PgPickedRecord,
  PgQueryBuilder,
  PgTypedStep,
  ReadonlyArrayOrDirect,
} from "../interfaces.ts";
import type { PgClassExpressionStep } from "./pgClassExpression.ts";
import { pgClassExpression } from "./pgClassExpression.ts";
import {
  makeWrappedMutationExecute,
  type PgMutationWrapper,
  type PgWrapCallback,
} from "./pgMutationWrapper.ts";
import type { PgSelectSingleStep } from "./pgSelectSingle.ts";
import { pgSelectSingleFromRecord } from "./pgSelectSingle.ts";

interface PgInsertSinglePlanFinalizeResults {
  table: SQL;
  returning: SQL;
}

/**
 * Inserts a row into resource with the given specified attribute values.
 */
export class PgInsertSingleStep<
    TResource extends PgResource<
      any,
      any,
      any,
      any,
      any,
      any,
      any
    > = PgResource,
  >
  extends Step<
    unknown[] // tuple depending on what's selected
  >
  implements
    SetterCapable<{
      [key in keyof GetPgResourceAttributes<TResource> & string]: Step;
    }>
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

  private wrappers: PgMutationWrapper<
    PgInsertSingleQueryBuilder,
    any,
    PgPickedRecord<PgCodecWithAttributes, any>
  >[] = [];

  constructor(
    resource: TResource,
    attributes?: {
      [key in keyof GetPgResourceAttributes<TResource>]?:
        | PgTypedStep<GetPgResourceAttributes<TResource>[key]["codec"]>
        | Step;
    },
  ) {
    super();
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
            value as Step,
          );
        }
      });
    }

    // This must happen last
    this.hasSideEffects = true;
  }

  public toStringMeta(): string | null {
    return `${this.resource.name}(${this.attributes.map((a) => a.name)})`;
  }

  set<TKey extends keyof GetPgResourceAttributes<TResource>>(
    name: TKey,
    value: Step, // | PgTypedStep<TAttributes[TKey]["codec"]>
    override = false,
  ): void {
    if (this.locked) {
      throw new Error("Cannot set after plan is locked.");
    }
    const existingIndex = this.attributes.findIndex((col) => col.name === name);
    if (existingIndex >= 0 && !override) {
      throw new Error(
        `Attribute '${name as string}' was specified more than once in ${this}`,
      );
    }
    if (existingIndex >= 0) this.attributes.splice(existingIndex, 1);
    const attribute = (
      this.resource.codec.attributes as GetPgResourceAttributes<TResource>
    )?.[name];
    if (!attribute) {
      throw new Error(
        `Attribute ${name as string} not found in ${this.resource.codec}`,
      );
    }
    const { codec: pgCodec } = attribute;
    const depId = this.addDependency(value);
    this.attributes.push({ name, depId, pgCodec });
  }

  __inferGet?: {
    [TAttr in keyof GetPgResourceAttributes<TResource>]: PgClassExpressionStep<
      GetPgResourceAttributes<TResource>[TAttr] extends PgCodecAttribute<
        infer UCodec
      >
        ? UCodec
        : never,
      TResource,
      PgCodecAttributeNullability<GetPgResourceAttributes<TResource>[TAttr]>
    >;
  };

  private _attrDetails<
    TAttr extends keyof GetPgResourceAttributes<TResource> & string,
  >(attr: TAttr) {
    if (!this.resource.codec.attributes) {
      throw new Error(`${this.resource.codec} has no attributes?!`);
    }
    const resourceAttribute: PgCodecAttribute =
      this.resource.codec.attributes[attr];
    if (!resourceAttribute) {
      throw new Error(
        `${this.resource} does not define an attribute named '${attr}'`,
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

    return {
      codec: resourceAttribute.codec,
      notNull: resourceAttribute.notNull,
      fragment: resourceAttribute.expression
        ? sql.parens(resourceAttribute.expression(this.alias))
        : sql`${this.alias}.${sql.identifier(attr)}`,
    };
  }

  /**
   * Returns a plan representing a named attribute (e.g. column) from the newly
   * inserted row.
   */
  get<TAttr extends keyof GetPgResourceAttributes<TResource> & string>(
    attr: TAttr,
  ): PgClassExpressionStep<
    GetPgResourceAttributes<TResource>[TAttr] extends PgCodecAttribute<
      infer UCodec
    >
      ? UCodec
      : never,
    TResource,
    PgCodecAttributeNullability<GetPgResourceAttributes<TResource>[TAttr]>
  > {
    if (!this.resource.codec.attributes) {
      throw new Error(`Cannot call .get() when there's no attributes.`);
    }
    const { codec, notNull, fragment } = this._attrDetails(attr);
    const sqlExpr = pgClassExpression(this, codec, notNull);
    const colPlan = sqlExpr`${fragment}`;
    return colPlan as any;
  }

  public getMeta(key: string) {
    return access(this, ["m", key]);
  }

  public getNotices() {
    return access(this, "n");
  }

  public record(): PgClassExpressionStep<
    GetPgResourceCodec<TResource>,
    TResource,
    never
  > {
    return pgClassExpression<GetPgResourceCodec<TResource>, TResource, never>(
      this,
      this.resource.codec as GetPgResourceCodec<TResource>,
      true,
    )`${this.alias}`;
  }

  /**
   * Creates a select step for this inserted record, enabling select-specific
   * APIs such as `.getClassStep()` and `.select()`.
   */
  public toSelectSingle(): PgSelectSingleStep<TResource, never> {
    return pgSelectSingleFromRecord(this.resource, this.record());
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

  selectedAttributeIndexes = new Map<string, number>();
  /**
   * More efficient version of selectAndReturnIndex for attributes
   *
   * @internal
   */
  public selectAttributeAndReturnIndex(
    attr: keyof TResource["codec"]["attributes"] & string,
  ): number {
    let idx = this.selectedAttributeIndexes.get(attr);
    if (idx == null) {
      const { fragment } = this._attrDetails(attr);
      idx = this.selectAndReturnIndex(fragment);
      this.selectedAttributeIndexes.set(attr, idx);
    }
    return idx;
  }

  apply(
    $step: Step<
      ReadonlyArrayOrDirect<Maybe<PgInsertSingleQueryBuilderCallback>>
    >,
  ) {
    this.applyDepIds.push(this.addUnaryDependency($step));
  }

  /** @experimental */
  public wrap<
    TDependencies extends Multistep,
    const TAttributes extends keyof TResource["codec"]["attributes"] & string,
  >(
    $deps: Thunk<TDependencies>,
    attributes: ReadonlyArray<TAttributes>,
    callback: PgWrapCallback<
      PgInsertSingleQueryBuilder,
      TDependencies,
      PgPickedRecord<TResource["codec"], TAttributes>
    >,
  ): void {
    if (this.locked) throw new Error("Cannot wrap after plan is locked.");
    const depId = this.withMyLayerPlan(() =>
      this.addDependency(multistep($deps)),
    );
    const selection = attributes.map(
      (attr) => [attr, this.selectAttributeAndReturnIndex(attr)] as const,
    );
    this.wrappers.push({ depId, selection, callback });
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
    const { resource, contextId, finalizeResults, alias } = this;
    const executor = this.resource.executor;
    if (!finalizeResults) {
      throw new Error("Cannot execute PgSelectStep before finalizing it.");
    }
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
    return indexMap<PromiseOrDirect<any>>(async (batchIndex) => {
      const context = contextDep.at(batchIndex);

      const sqlAttributes: SQL[] = [];
      const sqlValues: SQL[] = [];
      const setIndexes = new Map<string, number>();
      const rawValues: Record<string, unknown> = Object.create(null);
      for (const { depId, name, pgCodec } of this.attributes) {
        const attVal = values[depId].at(batchIndex);
        // `null` is kept, `undefined` is skipped
        if (attVal !== undefined) {
          const sqlIdent = sql.identifier(name as string);
          const sqlVal = sqlValueWithCodec(attVal, pgCodec);
          setIndexes.set(name as string, sqlAttributes.length);
          rawValues[name as string] = attVal;
          sqlAttributes.push(sqlIdent);
          sqlValues.push(sqlVal);
        }
      }

      const meta = Object.create(null);
      const queryBuilder: PgInsertSingleQueryBuilder & SQLable = {
        alias,
        [$$toSQL]() {
          return alias;
        },
        setMeta(key, value) {
          meta[key] = value;
        },
        getMetaRaw(key) {
          return meta[key];
        },
        getRaw(name) {
          return rawValues[name as string];
        },
        set(name, attVal, override = false) {
          const pgCodec = resource.codec.attributes[name]?.codec;
          if (!pgCodec) {
            throw new Error(`Attribute ${name} not recognized on ${resource}`);
          }
          const sqlIdent = sql.identifier(name as string);
          const sqlVal = sqlValueWithCodec(attVal, pgCodec);
          const existingIndex = setIndexes.get(name as string);
          if (existingIndex !== undefined) {
            if (!override) {
              throw new Error(
                `Attribute '${name as string}' was specified more than once in ${resource}`,
              );
            }
            sqlAttributes[existingIndex] = sqlIdent;
            sqlValues[existingIndex] = sqlVal;
          } else {
            setIndexes.set(name as string, sqlAttributes.length);
            sqlAttributes.push(sqlIdent);
            sqlValues.push(sqlVal);
          }
          rawValues[name as string] = attVal;
        },
        setBuilder() {
          return setter(this);
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

      const executeMutation = (client: GraphileConfig.DataplanPgClient) => {
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
        return executor._executeWithClient(
          client,
          text,
          stmtValues,
          undefined,
          undefined,
          true,
        );
      };
      const { rows, notices, rowCount } = await executor.executeMutation(
        { context },
        this.wrappers.length > 0
          ? makeWrappedMutationExecute<PgInsertSingleQueryBuilder, any>(
              this.wrappers,
              values,
              batchIndex,
              queryBuilder,
              executeMutation,
            )
          : executeMutation,
      );
      return {
        __proto__: null,
        m: meta,
        t: rows[0] ?? [],
        c: rowCount,
        n: notices,
      };
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
  /**
   * @deprecated Only present for backwards compatibility, we want TypeScript to reject these embeds.
   * @internal
   */
  private [$$toSQL]() {
    return this.alias;
  }
}

/**
 * Inserts a row into resource with the given specified attribute values.
 */
export function pgInsertSingle<
  TResource extends PgResource<any, any, any, any, any, any, any>,
>(
  resource: TResource,
  attributes?: {
    [key in keyof GetPgResourceAttributes<TResource>]?:
      | PgTypedStep<GetPgResourceAttributes<TResource>[key]["codec"]>
      | Step;
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
    override?: boolean,
  ): void;
  getRaw<
    TAttributeName extends keyof TResource["codec"]["attributes"] & string,
  >(
    key: TAttributeName,
  ):
    | PgCodecJSDatatype<
        TResource["codec"]["attributes"][TAttributeName]["codec"]
      >
    | undefined;
  setBuilder(): Setter<ObjectForResource<TResource>, this>;
}

type PgInsertSingleQueryBuilderCallback = (
  qb: PgInsertSingleQueryBuilder,
) => void;
