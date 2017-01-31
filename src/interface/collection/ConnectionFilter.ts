import { sql } from '../../postgres/utils'

type ConnectionFilter = (
  rawCondition: string,
  sql: mixed,
  context: mixed
) => {
  conditionSql: sql.Sql,
  fromSql: sql.Sql,
  groupBySql: sql.Sql,
}

export default ConnectionFilter
