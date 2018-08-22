import * as sql from "pg-sql2";

type SQL = sql.SQL;
export { sql, SQL };

export interface GenContext {
  queryBuilder: QueryBuilder;
}
export type Gen<T> = (context: GenContext) => T;

export type RawAlias = symbol | string;
export type SQLAlias = SQL;
export type SQLGen = Gen<SQL> | SQL;
export type NumberGen = Gen<number> | number;
export type CursorValue = object;
export type CursorComparator = (val: CursorValue, isAfter: boolean) => void;

export default class QueryBuilder {
  public beforeLock(field: string, fn: () => void): void;
  public setCursorComparator(fn: CursorComparator): void;
  public addCursorCondition(cursorValue: CursorValue, isAfter: boolean): void;
  public select(exprGen: SQLGen, alias: RawAlias): void;
  public selectCursor(exprGen: SQLGen): void;
  public from(expr: SQLGen, alias?: SQLAlias): void;
  public where(exprGen: SQLGen): void;
  public whereBound(exprGen: SQLGen, isLower: boolean): void;
  public setOrderIsUnique(): void;
  public orderBy(exprGen: SQLGen, ascending: boolean): void;
  public limit(limitGen: NumberGen): void;
  public offset(offsetGen: NumberGen): void;
  public first(first: number): void;
  public last(last: number): void;

  // ----------------------------------------

  public isOrderUnique(lock?: boolean): boolean;
  public getTableExpression(): SQL;
  public getTableAlias(): SQL;
  public getSelectCursor(): SQL;
  public getOffset(): number;
  public getFinalLimitAndOffset(): {
    limit: number;
    offset: number;
    flip: boolean;
  };
  public getFinalOffset(): number;
  public getFinalLimit(): number;
  public getOrderByExpressionsAndDirections(): Array<[SQL, boolean]>;
  public getSelectFieldsCount(): number;
  public buildSelectFields(): SQL;
  public buildSelectJson({ addNullCase }: { addNullCase?: boolean }): SQL;
  public buildWhereBoundClause(isLower: boolean): SQL;
  public buildWhereClause(
    includeLowerBound: boolean,
    includeUpperBound: boolean,
    { addNullCase }: { addNullCase?: boolean }
  ): SQL;
  public build(options?: {
    asJson?: boolean;
    asJsonAggregate?: boolean;
    onlyJsonField?: boolean;
    addNullCase?: boolean;
  }): SQL;

  // ----------------------------------------

  public lock(type: string): void;
  public checkLock(type: string): void;
  public lockEverything(): void;
}
