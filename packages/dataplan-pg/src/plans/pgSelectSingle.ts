import type {
  CrystalResultsList,
  CrystalValuesList,
  ObjectLikePlan,
} from "graphile-crystal";
import { ExecutablePlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgSource, PgSourceColumn, PgSourceRelation } from "../datasource";
import type { PgTypeCodec, PgTypedExecutablePlan } from "../interfaces";
import type { PgClassExpressionPlan } from "./pgClassExpression";
import { pgClassExpression } from "./pgClassExpression";
import { PgCursorPlan } from "./pgCursor";
import { PgSelectPlan } from "./pgSelect";
// import debugFactory from "debug";

// const debugPlan = debugFactory("datasource:pg:PgSelectSinglePlan:plan");
// const debugExecute = debugFactory("datasource:pg:PgSelectSinglePlan:execute");
// const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

export interface PgSelectSinglePlanOptions {
  fromRelation?: [PgSelectSinglePlan<any>, string];
}

/**
 * Represents the single result of a unique PgSelectPlan. This might be
 * retrieved explicitly by PgSelectPlan.single(), or implicitly (via
 * Graphile Crystal) by PgSelectPlan.item(). Since this is the result of a
 * fetch it does not make sense to support changing `.where` or similar;
 * however we now add methods such as `.get` and `.cursor` which can receive
 * specific properties by telling the PgSelectPlan to select the relevant
 * expressions.
 */
export class PgSelectSinglePlan<
    TDataSource extends PgSource<any, any, any, any>,
  >
  extends ExecutablePlan<TDataSource["TRow"]>
  implements
    PgTypedExecutablePlan<TDataSource["codec"]>,
    ObjectLikePlan<{
      [key in keyof TDataSource["TRow"]]: ExecutablePlan<
        TDataSource["TRow"][key]
      >;
    }>
{
  $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgSelectSinglePlan",
  };

  public readonly pgCodec: TDataSource["codec"];
  public readonly itemPlanId: number;
  private classPlanId: number;
  public readonly source: TDataSource;

  constructor(
    classPlan: PgSelectPlan<TDataSource>,
    itemPlan: ExecutablePlan<TDataSource["TRow"]>,
    private options: PgSelectSinglePlanOptions = Object.create(null),
  ) {
    super();
    this.source = classPlan.source;
    this.pgCodec = this.source.codec;
    this.classPlanId = classPlan.id;
    this.itemPlanId = this.addDependency(itemPlan);
  }

  public toStringMeta(): string {
    return this.source.name;
  }

  public getClassPlan(): PgSelectPlan<TDataSource> {
    if (this.aether.isOptimized(this)) {
      throw new Error(`Cannot ${this}.getClassPlan() after we're optimized.`);
    }
    const plan = this.getPlan(this.classPlanId);
    if (!(plan instanceof PgSelectPlan)) {
      throw new Error(
        `Expected ${this.classPlanId} (${plan}) to be a PgSelectPlan`,
      );
    }
    return plan;
  }

  private getItemPlan(): ExecutablePlan<TDataSource["TRow"]> {
    const plan = this.getPlan(this.dependencies[this.itemPlanId]);
    return plan;
  }

  getSelfNamed(): PgClassExpressionPlan<TDataSource, any> {
    // Hack because I don't want to duplicate the code.
    return this.get("" as any);
  }

  /**
   * Returns a plan representing a named attribute (e.g. column) from the class
   * (e.g. table).
   */
  get<TAttr extends keyof TDataSource["TRow"]>(
    attr: TAttr,
  ): PgClassExpressionPlan<
    TDataSource,
    TDataSource["columns"][TAttr]["codec"]
  > {
    const classPlan = this.getClassPlan();
    // TODO: where do we do the SQL conversion, e.g. to_json for dates to
    // enforce ISO8601? Perhaps this should be the datasource itself, and
    // `attr` should be an SQL expression? This would allow for computed
    // fields/etc too (admittedly those without arguments).
    const dataSourceColumn: PgSourceColumn =
      this.source.columns[attr as string];
    if (!dataSourceColumn && attr !== "") {
      throw new Error(
        `${this.source} does not define an attribute named '${attr}'`,
      );
    }

    if (dataSourceColumn?.via) {
      const { relation, attribute } = this.source.resolveVia(
        dataSourceColumn.via,
        attr as string,
      );
      return this.singleRelation(relation).get(attribute);
    }

    if (dataSourceColumn?.identicalVia) {
      const { relation, attribute } = this.source.resolveVia(
        dataSourceColumn.identicalVia,
        attr as string,
      );

      const $existingPlan = this.existingSingleRelation(relation);
      if ($existingPlan) {
        // Relation exists already; load it from there for efficiency
        return $existingPlan.get(attribute);
      } else {
        // Load it from ourself instead
      }
    }

    if (this.options.fromRelation) {
      const [$fromPlan, fromRelationName] = this.options.fromRelation;
      const matchingColumn = (
        Object.entries($fromPlan.source.columns) as Array<
          [string, PgSourceColumn]
        >
      ).find(([name, col]) => {
        if (col.identicalVia) {
          const { relation, attribute } = $fromPlan.source.resolveVia(
            col.identicalVia,
            name,
          );
          if (attribute === attr && relation === fromRelationName) {
            return true;
          }
        }
        return false;
      });
      if (matchingColumn) {
        return $fromPlan.get(matchingColumn[0]);
      }
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
      attr === ""
        ? this.source.codec
        : this.source.columns[attr as string].codec,
    );
    const colPlan = dataSourceColumn
      ? dataSourceColumn.expression
        ? sqlExpr`${sql.parens(dataSourceColumn.expression(classPlan.alias))}`
        : sqlExpr`${classPlan.alias}.${sql.identifier(String(attr))}`
      : sqlExpr`${classPlan.alias}.${classPlan.alias}`; /* self named */
    return colPlan;
  }

  public select(fragment: SQL): number {
    return this.getClassPlan().select(fragment);
  }

  public placeholder($plan: PgTypedExecutablePlan): SQL;
  public placeholder($plan: ExecutablePlan<any>, type: SQL): SQL;
  public placeholder(
    $plan: ExecutablePlan<any> | PgTypedExecutablePlan,
    overrideType?: SQL,
  ): SQL {
    return overrideType
      ? this.getClassPlan().placeholder($plan, overrideType)
      : this.getClassPlan().placeholder($plan as PgTypedExecutablePlan);
  }

  private existingSingleRelation<
    TRelationName extends Parameters<TDataSource["getRelation"]>[0],
  >(relationIdentifier: TRelationName): PgSelectSinglePlan<any> | null {
    if (this.options.fromRelation) {
      const [$fromPlan, fromRelationName] = this.options.fromRelation;
      // check to see if we already came via this relationship
      const reciprocal = this.source.getReciprocal(
        $fromPlan.source,
        fromRelationName,
      );
      if (reciprocal) {
        const reciprocalRelationName = reciprocal[0] as string;
        if (reciprocalRelationName === relationIdentifier) {
          const reciprocalRelation: PgSourceRelation<any, any> = reciprocal[1];
          if (reciprocalRelation.isUnique) {
            return $fromPlan;
          }
        }
      }
    }
    return null;
  }

  public singleRelation<
    TRelationName extends Parameters<TDataSource["getRelation"]>[0],
  >(relationIdentifier: TRelationName): PgSelectSinglePlan<any> {
    const $existingPlan = this.existingSingleRelation(relationIdentifier);
    if ($existingPlan) {
      return $existingPlan;
    }
    const relation = this.source.getRelation(relationIdentifier as string);
    if (!relation || !relation.isUnique) {
      throw new Error(
        `${relationIdentifier} is not a unique relation on ${this.source}`,
      );
    }
    const relationSource = relation.source as PgSource<any, any, any, any, any>;
    const remoteColumns = relation.remoteColumns as string[];
    const localColumns = relation.localColumns as string[];

    const options: PgSelectSinglePlanOptions = {
      fromRelation: [this, relationIdentifier as string],
    };
    return relationSource.get(
      remoteColumns.reduce((memo, remoteColumn, columnIndex) => {
        memo[remoteColumn] = this.get(localColumns[columnIndex]);
        return memo;
      }, Object.create(null)),
      options,
    );
  }

  public manyRelation<
    TRelationName extends Parameters<TDataSource["getRelation"]>[0],
  >(relationIdentifier: TRelationName): PgSelectPlan<any> {
    const relation = this.source.getRelation(relationIdentifier as string);
    if (!relation) {
      throw new Error(
        `${relationIdentifier} is not a relation on ${this.source}`,
      );
    }
    const relationSource = relation.source as PgSource<any, any, any, any, any>;
    const remoteColumns = relation.remoteColumns as string[];
    const localColumns = relation.localColumns as string[];

    return relationSource.find(
      remoteColumns.reduce((memo, remoteColumn, columnIndex) => {
        memo[remoteColumn] = this.get(localColumns[columnIndex]);
        return memo;
      }, Object.create(null)),
    );
  }

  record(): PgClassExpressionPlan<TDataSource, TDataSource["codec"]> {
    return pgClassExpression(this, this.source.codec)`${
      this.getClassPlan().alias
    }`;
  }

  /**
   * Returns a plan representing the result of an expression.
   */
  expression<TCodec extends PgTypeCodec>(
    expression: SQL,
    codec: TCodec,
  ): PgClassExpressionPlan<TDataSource, TCodec> {
    return pgClassExpression(this, codec)`${expression}`;
  }

  /**
   * When selecting a connection we need to be able to get the cursor. The
   * cursor is built from the values of the `ORDER BY` clause so that we can
   * find nodes before/after it.
   */
  public cursor(): PgCursorPlan<TDataSource> {
    const cursorPlan = new PgCursorPlan<TDataSource>(this);
    return cursorPlan;
  }

  deduplicate(
    peers: PgSelectSinglePlan<any>[],
  ): PgSelectSinglePlan<TDataSource> {
    const identicalPeer = peers.find((peer) => {
      if (peer.source !== this.source) {
        return false;
      }
      if (peer.getClassPlan() !== this.getClassPlan()) {
        return false;
      }
      if (peer.getItemPlan() !== this.getItemPlan()) {
        return false;
      }
      return true;
    });
    if (identicalPeer) {
      // We've been careful to not store anything locally so we shouldn't
      // need to move anything across to the peer.
      return identicalPeer;
    } else {
      return this;
    }
  }

  execute(
    values: CrystalValuesList<[TDataSource["TRow"]]>,
  ): CrystalResultsList<TDataSource["TRow"]> {
    return values.map((value) => value[this.itemPlanId]);
  }
}

export const pgSelectSingleFromRecord = Object.assign(
  function pgSelectSingleFromRecord<
    TDataSource extends PgSource<any, any, any, any>,
  >(
    source: TDataSource,
    record: PgClassExpressionPlan<TDataSource, TDataSource["codec"]>,
  ): PgSelectSinglePlan<TDataSource> {
    // TODO: we should be able to optimise this so that `plan.record()` returns the original record again.
    return new PgSelectPlan({
      source,
      identifiers: [],
      from: (record) => sql`(select (${record}).*)`,
      args: [{ plan: record, type: source.codec.sqlType }],
    }).single();
  },
  {
    $$export: {
      moduleName: "@dataplan/pg",
      exportName: "pgSelectSingleFromRecord",
    },
  },
);
