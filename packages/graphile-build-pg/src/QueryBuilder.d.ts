import * as sql from "pg-sql2";
import { PgClass } from "./plugins/PgIntrospectionPlugin";

type SQL = sql.SQL;
export { sql, SQL };

export type GraphQLContext = any;

export interface GenContext {
  queryBuilder: QueryBuilder;
}
export type Gen<T> = (context: GenContext) => T;

export type RawAlias = symbol | string;
export type SQLAlias = SQL;
export type SQLGen = Gen<SQL> | SQL;
export type NumberGen = Gen<number> | number;
export type CursorValue = Array<any>;
export type CursorComparator = (val: CursorValue, isAfter: boolean) => void;

export default class QueryBuilder {
  public parentQueryBuilder: QueryBuilder | void;
  public context: GraphQLContext;
  public rootValue: any;
  public beforeLock(field: string, fn: () => void): void;
  public makeLiveCollection(
    table: PgClass,
    cb?: (checker: (data: any) => (record: any) => boolean) => void
  ): void;
  public addLiveCondition(
    checkerGenerator: (data: {}) => (record: any) => boolean,
    requirements?: { [key: string]: SQL }
  ): void;
  public setCursorComparator(fn: CursorComparator): void;
  public addCursorCondition(cursorValue: CursorValue, isAfter: boolean): void;
  public select(exprGen: SQLGen, alias: RawAlias): void;
  public selectIdentifiers(table: PgClass): void;
  public selectCursor(exprGen: SQLGen): void;
  public from(expr: SQLGen, alias?: SQLAlias): void;
  public where(exprGen: SQLGen): void;
  public whereBound(exprGen: SQLGen, isLower: boolean): void;
  public setOrderIsUnique(): void;
  public orderBy(
    exprGen: SQLGen,
    ascending?: boolean,
    nullsFirst?: boolean | null
  ): void;
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
  public getOrderByExpressionsAndDirections(): Array<
    [SQL, boolean, boolean | null]
  >;
  public getSelectFieldsCount(): number;
  public buildSelectFields(): SQL;
  public buildSelectJson({
    addNullCase,
    addNotDistinctFromNullCase,
  }: {
    addNullCase?: boolean;
    addNotDistinctFromNullCase?: boolean;
  }): SQL;
  public buildWhereBoundClause(isLower: boolean): SQL;
  public buildWhereClause(
    includeLowerBound: boolean,
    includeUpperBound: boolean,
    {
      addNullCase,
      addNotDistinctFromNullCase,
    }: { addNullCase?: boolean; addNotDistinctFromNullCase?: boolean }
  ): SQL;
  public build(options?: {
    asJson?: boolean;
    asJsonAggregate?: boolean;
    onlyJsonField?: boolean;
    addNullCase?: boolean;
    addNotDistinctFromNullCase?: boolean;
    useAsterisk?: boolean;
  }): SQL;
  public buildChild(): QueryBuilder;
  public buildNamedChildSelecting(
    name: RawAlias,
    from: SQLGen,
    selectExpression: SQLGen,
    alias?: SQLAlias
  ): QueryBuilder;
  public getNamedChild(name: RawAlias): QueryBuilder | undefined;

  // ----------------------------------------

  public lock(type: string): void;
  public checkLock(type: string): void;
  public lockEverything(): void;
}
