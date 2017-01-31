import { Condition } from '../../interface'
import { sql } from '../utils'

/**
 * Converts a `Condition` object into a Sql query.
 * The `otherSql` arg is modified in place. Not a great API, but simplifies this recursive function quite a bit
 */
export default function conditionToSql (condition: Condition, path: Array<string> = [], context = {}, otherSql = {}): sql.Sql {
  if (typeof condition === 'boolean')
    return condition ? sql.query`true` : sql.query`false`

  switch (condition.type) {
    case 'NOT':
      return sql.query`not(${conditionToSql(condition.condition, path, context, otherSql)})`
    case 'AND':
      return sql.query`(${sql.join(condition.conditions.map(c => conditionToSql(c, path, context, otherSql)), ' and ')})`
    case 'OR':
      return sql.query`(${sql.join(condition.conditions.map(c => conditionToSql(c, path, context, otherSql)), ' or ')})`
    case 'FIELD':
      // TODO: This is a hack fix. Do a proper fix asap!
      return conditionToSql(
        condition.condition,
        path.concat([context.convertRowIdToId && condition.name === 'row_id' ? 'id' : condition.name]),
        false, context, otherSql
      )
    case 'EQUAL':
      return sql.query`(${sql.identifier(...path)} = ${sql.value(condition.value)})`
    case 'LESS_THAN':
      return sql.query`(${sql.identifier(...path)} < ${sql.value(condition.value)})`
    case 'GREATER_THAN':
      return sql.query`(${sql.identifier(...path)} > ${sql.value(condition.value)})`
    case 'REGEXP':
      // Parse out the regular expression. In Node.js v4 we can’t get the
      // `flags` property so we need to do it this way.
      const match = condition.regexp.toString().match(/^\/(.*)\/([gimuy]*)$/i)
      if (!match) throw new Error('Invalid regular expression.')
      const [, pattern, flags] = match
      return sql.query`regexp_matches(${sql.identifier(...path)}, ${sql.value(pattern)}, ${sql.value(flags)})`
    case 'CUSTOM':
      const { conditionSql, fromSql, groupBySql } = condition.filter(condition.value, sql, context);
      if (fromSql != null) otherSql.fromSql = fromSql
      if (groupBySql != null) otherSql.groupBySql = groupBySql
      return conditionSql
    default:
      throw new Error(`Condition of type '${condition['type']}' is not recognized.`)
  }
}
