import { Condition } from '../../catalog'
import * as sql from '../utils/sql'

/**
 * Converts a `Condition` object into a SQL query.
 */
export default function conditionToSQL (condition: Condition, path: string[] = []): sql.SQL {
  if (typeof condition === 'boolean')
    return condition ? sql.query`true` : sql.query`false`

  switch (condition.type) {
    case 'NOT':
      return sql.query`not(${conditionToSQL(condition.condition, path)})`
    case 'AND':
      return sql.query`(${sql.join(condition.conditions.map(condition => conditionToSQL(condition, path)), ' and ')})`
    case 'OR':
      return sql.query`(${sql.join(condition.conditions.map(condition => conditionToSQL(condition, path)), ' or ')})`
    case 'FIELD':
      // TODO: Because of our implementation, using the field condition name
      // directly is valid, however this is technically the incorrect
      // implementation. We should really be looking at an `ObjectField` of the
      // condition’s name instance and getting the column name from that. Low
      // priority, but it’s worth noting. Same deal as
      // `PGCollection#_valueToRow`.
      return conditionToSQL(condition.condition, path.concat([condition.name]))
    case 'EQUAL':
      return sql.query`(${sql.identifier(...path)} = ${sql.value(condition.value)})`
    case 'LESS_THAN':
      return sql.query`(${sql.identifier(...path)} < ${sql.value(condition.value)})`
    case 'GREATER_THAN':
      return sql.query`(${sql.identifier(...path)} > ${sql.value(condition.value)})`
    case 'REGEXP':
      return sql.query`regexp_matches(${sql.identifier(...path)}, ${sql.value(condition.regexp.source)}, ${sql.value(condition.regexp.flags)})`
  }
}
