import { memoize } from 'lodash'
import { GraphQLNonNull } from 'graphql'
import { NodeType, IDType } from '../types.js'
import resolveTableSingle from '../resolveTableSingle.js'

const createNodeQueryField = schema => {
  const getTable = memoize(tableName => schema.catalog.getTable(schema.name, tableName))
  return {
    type: NodeType,
    description: 'Fetches an object given its globally unique `ID`.',

    args: {
      id: {
        type: new GraphQLNonNull(IDType),
        description: 'The `ID` of the node.',
      },
    },

    resolve: (source, args, context) => {
      const { id } = args
      const table = getTable(id.tableName)
      if (!table) throw new Error(`No table '${id.tableName}' in schema '${schema.name}'.`)
      return getResolver(table)(source, args, context)
    },
  }
}

export default createNodeQueryField

// This function will be called for every resolution, therefore it is (and
// must be) memoized.
const getResolver = memoize(table => resolveTableSingle(
  table,
  table.primaryKeys,
  (source, args) => args.id.values,
))
