import assert from "assert";
import type { UnbatchedExecutionExtra } from "grafast";
import { UnbatchedExecutableStep } from "grafast";
import type { SQL } from "pg-sql2";
import { sql } from "pg-sql2";

import type { PgCodec, PgSQLCallbackOrDirect } from "../interfaces.js";

/** Only valid on unions */
type UnionSelect =
  | { type: "pk" }
  | { type: "type" }
  | { type: "outerExpression"; expression: SQL };

/** Valid on anything selectable (including INSERT/UPDATE/DELETE) */
type StandardSelect<TAttributes extends string> =
  | { type: "attribute"; attribute: TAttributes }
  | { type: "rawExpression"; expression: SQL }
  | { type: "expression"; expression: SQL; codec: PgCodec };

/** Selects that the PgQueryBuilderStep can support - notably since order is runtime, it cannot include that */
export type PgQueryBuilderStepSelect<TAttributes extends string> =
  | StandardSelect<TAttributes>
  | UnionSelect;

/** Selects that the QueryBuilder can support - includes order since it runs at runtime */
export type QueryBuilderSelect<TAttributes extends string> =
  | StandardSelect<TAttributes>
  | UnionSelect
  | { type: "order"; orderIndex: number };

// TODO: assert this step is unary!
// WARNING: this should only handle unary concerns (such as input values from
// GraphQL arguments/etc); it should NOT handle non-unary concerns such as
// parent fetches in a plan resolver inside a list (e.g.
// `users.get($post.get('author_id'))`) since this would stop it being unary.
export class PgQueryBuilderStep<
  TAttributes extends string = string,
> extends UnbatchedExecutableStep<QueryBuilder<TAttributes>> {
  static $$export = {
    moduleName: "@dataplan/pg",
    exportName: "PgQueryBuilderStep",
  };

  static clone<TAttributes extends string>(
    source: PgQueryBuilderStep<TAttributes>,
    newMode = source.mode,
  ) {
    const clone = new PgQueryBuilderStep<TAttributes>(source.alias, newMode);
    for (const [key, value] of source._symbolSubstitutes.entries()) {
      clone._symbolSubstitutes.set(key, value);
    }
    if (newMode === source.mode) {
      clone._selects = [...source._selects];
    }
    return clone;
  }

  /** Regular selects for fields, but also extra selects needed for cursors */
  private _selects: PgQueryBuilderStepSelect<TAttributes>[] = [];

  /**
   * When SELECTs get merged, symbols also need to be merged. The keys in this
   * map are the symbols of PgSelects that don't exist any more, the values are
   * symbols of the PgSelects that they were replaced with (which might also not
   * exist in future, but we follow the chain so it's fine).
   */
  private readonly _symbolSubstitutes = new Map<symbol, symbol>();

  constructor(
    private readonly alias: SQL,
    public readonly mode: "normal" | "mutation" | "aggregate",
  ) {
    super();
  }

  public getSymbolSubstitutes(): Map<symbol, symbol> {
    return this._symbolSubstitutes;
  }

  public getSelects(): ReadonlyArray<PgQueryBuilderStepSelect<TAttributes>> {
    // TODO: this.assertLocked()
    return this._selects;
  }

  /**
   * Select an SQL fragment, returning the index the result will have.
   *
   * @internal
   */
  public selectAndReturnIndex(
    select: PgQueryBuilderStepSelect<TAttributes>,
  ): number {
    if (!this.isArgumentsFinalized) {
      throw new Error("Select added before arguments were finalized");
    }
    // NOTE: it's okay to add selections after the plan is "locked" - lock only
    // applies to which rows are being selected, not what is being queried
    // about the rows.

    // Optimisation: if we're already selecting this fragment, return the existing one.
    const filter = ((): ((
      sel: PgQueryBuilderStepSelect<TAttributes>,
    ) => boolean) => {
      switch (select.type) {
        case "pk":
          return (sel) => sel.type === "pk";
        case "type":
          return (sel) => sel.type === "type";
        case "attribute": {
          const { attribute } = select;
          return (sel) =>
            sel.type === "attribute" && sel.attribute === attribute;
        }
        case "expression": {
          const options = { symbolSubstitutes: this._symbolSubstitutes };
          const { expression } = select;
          return (sel) =>
            sel.type === "expression" &&
            sel.codec === select.codec &&
            sql.isEquivalent(sel.expression, expression, options);
        }
        case "rawExpression":
        case "outerExpression": {
          const options = { symbolSubstitutes: this._symbolSubstitutes };
          const { expression, type } = select;
          return (sel) =>
            sel.type === type &&
            sql.isEquivalent(sel.expression, expression, options);
        }
        default: {
          const never: never = select;
          throw new Error(`Unhandled select type ${(never as any).type}`);
        }
      }
    })();
    const index = this._selects.findIndex(filter);
    if (index >= 0) {
      return index;
    }

    return this._selects.push(select) - 1;
  }

  unbatchedExecute(extra: UnbatchedExecutionExtra, ...values: any[]) {
    const queryBuilder = new QueryBuilder<TAttributes>(this.alias);
    for (let i = 0, l = this._selects.length; i < l; i++) {
      const sel = this._selects[i];
      const idx = queryBuilder.selectAndReturnIndex(sel);
      assert.equal(
        idx,
        i,
        `queryBuilder select index must match local _select index`,
      );
    }
    return queryBuilder;
  }
}

export class QueryBuilder<TAttributes extends string = string> {
  /** Regular selects for fields, but also extra selects needed for cursors */
  private _selects: QueryBuilderSelect<TAttributes>[] = [];

  /** Unary wheres from conditions/filter args, but also extra unary wheres from cursors */
  private _where: any[] = [];

  /** Unary orderBys from GraphQL orderBy arg, but also order by PK or similar to make it unique */
  private _orderBy: any[] = [];

  /** Unary groupBys from GraphQL groupBy arg */
  private _groupBy: any[] = [];

  private _having: any[] = [];

  private _shouldSelectOrderIndexes = false;

  private _locked = false;

  constructor(private alias: SQL) {}

  private assertUnlocked(
    message = "QueryBuilder is locked; further changes forbidden",
  ) {
    assert.equal(this._locked, false, message);
  }

  private assertLocked(
    message = "QueryBuilder is not yet locked; referencing incomplete values is forbidden",
  ) {
    assert.equal(this._locked, true, message);
  }

  public selectOrderIndexes(): void {
    this.assertUnlocked();
    this._shouldSelectOrderIndexes = true;
  }

  public selectAndReturnIndex(sel: QueryBuilderSelect<TAttributes>): number {
    // TODO: should we dynamically eliminate duplicate selects?
    return this._selects.push(sel) - 1;
  }

  public getSelects(): ReadonlyArray<QueryBuilderSelect<TAttributes>> {
    return this._selects;
  }

  /* OR: get orders and indexes? */
  /** The `select` indexes at which you can find each of the orderBy values, used primarily by cursors */
  public getOrderIndexes() {
    this.assertLocked();
    assert.equal(
      this._shouldSelectOrderIndexes,
      true,
      `Cannot get orderIndexes if they weren't selected - be sure to call queryBuilder.selectOrderIndexes()`,
    );
  }
}
