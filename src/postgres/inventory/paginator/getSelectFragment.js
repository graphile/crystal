import { sql } from '../../utils'

export default (resolveInfo, aliasIdentifier) => {
  return sql.query`to_json(${sql.identifier(aliasIdentifier)})`
}
