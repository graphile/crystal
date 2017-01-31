import { sql } from '../../postgres/utils'

type ConnectionFilter = (
  rawCondition: string,
  sql: mixed,
  context: {
    initialTable: string,
    initialSchema: string,
    convertRowIdToId: boolean,
  }
) => {
  conditionSql: sql.Sql,
  fromSql: sql.Sql,
  groupBySql: sql.Sql,
}

export default ConnectionFilter
