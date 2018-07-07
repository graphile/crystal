declare module 'pg-sql2' {
  import { QueryConfig } from 'pg'

  interface SQLNode {}
  type SQLQuery = Array<SQLNode>

  export function compile(query: SQLQuery): QueryConfig
  export function query(strings: TemplateStringsArray, ...values: Array<SQLNode | SQLQuery>): SQLQuery
  export function value(val: any): SQLNode
  export function join(items: Array<SQLNode | SQLQuery>, separator?: string): SQLQuery
}
