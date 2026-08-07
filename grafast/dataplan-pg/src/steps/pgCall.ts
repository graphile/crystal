import type {
  ExecutionDetails,
  GrafastResultsList,
  PromiseOrDirect,
} from "grafast";
import { access, exportAs, Step } from "grafast";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgCodecAttribute } from "../codecs.ts";
import { sqlValueWithCodec } from "../codecs.ts";
import type { PgResource } from "../datasource.ts";
import type { PgCodec } from "../interfaces.ts";
import type { PgClassExpressionStep } from "./pgClassExpression.ts";
import { pgClassExpression } from "./pgClassExpression.ts";
import type {
  PgSelectArgumentDigest,
  PgSelectArgumentSpec,
} from "./pgSelect.ts";

/**
 * Invokes a PostgreSQL PROCEDURE via a `call` statement.
 *
 * A function is embedded in a `select ... from func(...)`, so it can take
 * part in the wider query: joins, filters, inlining, and so on. A procedure
 * has none of that. It can only be invoked as a standalone `call proc(...)`
 * statement, and PostgreSQL requires every one of its positional arguments
 * to be supplied, including OUT-only arguments (whose value is then
 * discarded). The `call` statement returns, at most, a single row
 * containing the procedure's OUT/INOUT parameters, named accordingly.
 */
export class PgCallStep<
  TResource extends PgResource<any, any, any, any, any> = PgResource,
> extends Step<PgCallStepResult> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgCallStep",
  };

  isSyncAndSafe = false;

  public readonly resource: TResource;

  /**
   * Used as an alias within `get()`-built expressions. It never appears in
   * any SQL we actually execute (see `selectAndReturnIndex` below); it only
   * needs to be unique so expressions for different `PgCallStep`s can't be
   * confused with one another.
   */
  public readonly alias: SQL;
  private readonly symbol: symbol;

  private readonly contextId: number;

  /** One entry per argument exposed to us (i.e. `i`/`b` mode only). */
  private readonly argDeps: ReadonlyArray<{
    depId: number;
    pgCodec: PgCodec;
  }>;

  /**
   * The fixed position each output attribute occupies within the row `call`
   * returns, alongside the `::text`-cast expression `PgClassExpressionStep`
   * would build for it. This is what lets us resolve `selectAndReturnIndex()`
   * without ever compiling or running that expression as real SQL (`call`
   * can't be wrapped in a `select`, so there's nothing to select it *from*).
   */
  private readonly outputsByFragmentText: ReadonlyArray<{
    fragment: SQL;
    index: number;
  }>;

  private applyDepIds: number[] = [];

  constructor(resource: TResource, args: ReadonlyArray<PgSelectArgumentSpec>) {
    super();
    this.resource = resource;
    this.symbol = Symbol(resource.name);
    this.alias = sql.identifier(this.symbol);
    this.contextId = this.addDependency(resource.executor.context());
    this.argDeps = args.map((spec) => ({
      depId: this.addDependency(spec.step),
      pgCodec: (spec.pgCodec ?? (spec.step as any).pgCodec) as PgCodec,
    }));

    const attributes = resource.codec.attributes as
      | Record<string, PgCodecAttribute>
      | undefined;
    this.outputsByFragmentText = attributes
      ? Object.entries(attributes).map(([name, attribute], index) => {
          const expression = sql`${this.alias}.${sql.identifier(name)}`;
          // Mirrors `pgClassExpression()` + `PgClassExpressionStep.optimize()`
          // exactly, since we must produce a fragment that's equivalent to
          // whatever they'll ask `selectAndReturnIndex()` to resolve.
          const guaranteedNotNull =
            attribute.codec.notNull || attribute.notNull;
          const fragment = attribute.codec.castFromPg
            ? attribute.codec.castFromPg(expression, guaranteedNotNull)
            : sql`${sql.parens(expression)}::text`;
          return { fragment, index };
        })
      : [];

    // This must happen last
    this.hasSideEffects = true;
  }

  public toStringMeta(): string | null {
    return this.resource.name;
  }

  /**
   * Used to allow other plugins (e.g. `clientMutationId` handling) to stash
   * metadata against this call. This matches the `ApplyableStep` protocol,
   * so we can be used anywhere a `PgSelectStep` would be for this purpose.
   */
  apply($step: Step<(qb: PgCallQueryBuilder) => void>) {
    this.applyDepIds.push(this.addUnaryDependency($step));
  }

  public getMeta(key: string) {
    return access(this, ["m", key]);
  }

  public getNotices() {
    return access(this, "n");
  }

  __inferGet?: {
    [TAttr in keyof NonNullable<
      TResource["codec"]["attributes"]
    >]: PgClassExpressionStep<
      NonNullable<TResource["codec"]["attributes"]>[TAttr]["codec"],
      TResource
    >;
  };
  /**
   * Returns a plan representing a named OUT/INOUT parameter from the
   * procedure's result row.
   */
  get<TAttr extends string>(
    attr: TAttr,
  ): PgClassExpressionStep<PgCodec, TResource> {
    const attribute = this.resource.codec.attributes?.[attr];
    if (!attribute) {
      throw new Error(
        `${this.resource} does not define an output attribute named '${attr}'`,
      );
    }
    const sqlExpr = pgClassExpression<PgCodec, TResource>(
      this,
      attribute.codec,
      attribute.notNull,
    );
    return sqlExpr`${this.alias}.${sql.identifier(attr)}`;
  }

  /**
   * `call` cannot appear in a `select`, so compiling and running `fragment`
   * directly isn't an option. Instead we match it against the fixed,
   * precomputed expression for each output attribute and return that
   * attribute's (equally fixed) position in the row `call` returns.
   */
  public selectAndReturnIndex(fragment: SQL): number {
    const found = this.outputsByFragmentText.find((entry) =>
      sql.isEquivalent(entry.fragment, fragment),
    );
    if (!found) {
      throw new Error(
        `${this}: could not resolve output position for expression ${sql.compile(fragment).text}`,
      );
    }
    return found.index;
  }

  async execute({
    indexMap,
    values,
  }: ExecutionDetails): Promise<GrafastResultsList<PgCallStepResult>> {
    const { resource, contextId } = this;
    const contextDep = values[contextId];
    const procedureArguments = resource.procedureArguments ?? [];

    return indexMap<PromiseOrDirect<PgCallStepResult>>(async (i) => {
      const context = contextDep.at(i);

      const argValues = this.argDeps.map(({ depId, pgCodec }) => {
        const raw = values[depId].at(i);
        return { pgCodec, value: raw };
      });

      let nextArgIndex = 0;
      const digests: PgSelectArgumentDigest[] = procedureArguments.map(
        (arg) => {
          if (arg.mode === "o") {
            return { placeholder: sql`null::${arg.codec.sqlType}` };
          }
          const argValue = argValues[nextArgIndex++];
          return {
            placeholder: sqlValueWithCodec(argValue.value, argValue.pgCodec),
          };
        },
      );

      const meta = Object.create(null);
      const queryBuilder: PgCallQueryBuilder = {
        setMeta(key, value) {
          meta[key] = value;
        },
        getMetaRaw(key) {
          return meta[key];
        },
      };
      for (const applyDepId of this.applyDepIds) {
        const callback = values[applyDepId].unaryValue() as
          | ((qb: PgCallQueryBuilder) => void)
          | null
          | undefined;
        callback?.(queryBuilder);
      }

      const from = resource.from as (...args: PgSelectArgumentDigest[]) => SQL;
      const query = sql`call ${from(...digests)};`;
      const { text, values: stmtValues } = sql.compile(query);

      const { rows, notices } = await this.resource.executeMutation<
        ReadonlyArray<string | null>
      >({
        context,
        text,
        values: stmtValues,
        rawText: true,
      });
      return {
        __proto__: null,
        m: meta,
        t: rows[0] ?? [],
        n: notices,
      };
    });
  }
}

interface PgCallStepResult {
  m: Record<string, unknown>;
  t: ReadonlyArray<string | null>;
  n: readonly unknown[] | undefined;
}

export interface PgCallQueryBuilder {
  setMeta(key: string, value: unknown): void;
  getMetaRaw(key: string): unknown;
}

/**
 * Invokes a PostgreSQL PROCEDURE via `call proc(...)`.
 */
export function pgCall<
  TResource extends PgResource<any, any, any, any, any>,
>(options: {
  resource: TResource;
  args?: ReadonlyArray<PgSelectArgumentSpec>;
}): PgCallStep<TResource> {
  return new PgCallStep(options.resource, options.args ?? []);
}
exportAs("@dataplan/pg", pgCall, "pgCall");
