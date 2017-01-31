import { sql } from '../../postgres/utils'

type ConnectionFilter = (
  rawCondition: string,  // raw GraphQL connection argument `condition`
  sql: mixed,  // a set of SQL generation helper functions
  context: {
    initialTable: string,  // the name of the connection's base table
    initialSchema: string,  // the schema for the connection's base table
  }
) => {
  conditionSql: sql.Sql,  // part of the `where` clause
  fromSql: sql.Sql,  // `from` clause; leave `undefined` to use the default
  groupBySql: sql.Sql,  // `group by` clause; leave `undefined` to use the default (empty)
}

export default ConnectionFilter
