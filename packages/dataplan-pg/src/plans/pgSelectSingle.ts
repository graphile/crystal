import type { CrystalResultsList, CrystalValuesList } from "graphile-crystal";
import { ExecutablePlan } from "graphile-crystal";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgSource } from "../datasource";
import type { PgTypeCodec, PgTypedExecutablePlan } from "../interfaces";
import type { PgClassExpressionPlan } from "./pgClassExpression";
import { pgClassExpression } from "./pgClassExpression";
import { PgCursorPlan } from "./pgCursor";
import type { PgRecordPlan } from "./pgRecord";
import { pgRecord } from "./pgRecord";
import { PgSelectPlan } from "./pgSelect";
// import debugFactory from "debug";

// const debugPlan = debugFactory("datasource:pg:PgSelectSinglePlan:plan");
// const debugExecute = debugFactory("datasource:pg:PgSelectSinglePlan:execute");
// const debugPlanVerbose = debugPlan.extend("verbose");
// const debugExecuteVerbose = debugExecute.extend("verbose");

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
  implements PgTypedExecutablePlan<TDataSource["codec"]>
{
  public readonly pgCodec: TDataSource["codec"];
  public readonly itemPlanId: number;
  private classPlanId: number;
  public readonly dataSource: TDataSource;

  constructor(
    classPlan: PgSelectPlan<TDataSource>,
    itemPlan: ExecutablePlan<TDataSource["TRow"]>,
  ) {
    super();
    this.dataSource = classPlan.dataSource;
    this.pgCodec = this.dataSource.codec;
    this.classPlanId = classPlan.id;
    this.itemPlanId = this.addDependency(itemPlan);
  }

  public toStringMeta(): string {
    return this.dataSource.name;
  }

  public getClassPlan(): PgSelectPlan<TDataSource> {
    const plan = this.aether.plans[this.classPlanId];
    if (!(plan instanceof PgSelectPlan)) {
      throw new Error(
        `Expected ${this.classPlanId} (${plan}) to be a PgSelectPlan`,
      );
    }
    return plan;
  }

  private getItemPlan(): ExecutablePlan<TDataSource["TRow"]> {
    const plan = this.aether.plans[this.dependencies[this.itemPlanId]];
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
    const dataSourceColumn = this.dataSource.columns[attr as string];
    if (!dataSourceColumn && attr !== "") {
      throw new Error(
        `${this.dataSource} does not define an attribute named '${attr}'`,
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
      attr === ""
        ? this.dataSource.codec
        : this.dataSource.columns[attr as string].codec,
    );
    const colPlan = dataSourceColumn
      ? dataSourceColumn.expression
        ? sqlExpr`${sql.parens(dataSourceColumn.expression(classPlan.alias))}`
        : sqlExpr`${classPlan.alias}.${sql.identifier(String(attr))}`
      : sqlExpr`${classPlan.alias}.${classPlan.alias}`; /* self named */
    return colPlan;
  }

  record(): PgRecordPlan<TDataSource> {
    return pgRecord(this);
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
      if (peer.dataSource !== this.dataSource) {
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
