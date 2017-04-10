import { sql } from '../../utils'

abstract class PgDependency {
  public abstract getExpression(alias: sql.Sql): sql.Sql
}

export default PgDependency
