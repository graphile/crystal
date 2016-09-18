import { sql } from '../../utils'

class PGType {
  public getSQLSelectExpression (identifier: sql.SQL): sql.SQL {
    return identifier
  }
}

class PGCompositeType extends PGType {
  public getSQLSelectExpression (identifier: sql.SQL): sql.SQL {
    return sql.query`to_json(${identifier})`
  }
}

class PGDomainType extends PGType {}

class PGEnumType extends PGType {}

class PGArrayType extends PGType {
  public getSQLSelectExpression (identifier: sql.SQL): sql.SQL {
    return sql.query`to_json(${identifier})`
  }
}

export default PGType
