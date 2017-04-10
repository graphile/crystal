import { sql } from '../../utils'
import PgClassType from '../type/PgClassType'
import PgDependency from './PgDependency'

class PgAttributeDepedency extends PgDependency {
  constructor(
    private _field: PgClassType.Field<mixed>,
  ) {
    super()
  }

  public getExpression(alias: sql.Sql): sql.Sql {
    return sql.query`${alias}.${sql.identifier(this._field.pgAttribute.name)}`
  }
}

export default PgAttributeDepedency
