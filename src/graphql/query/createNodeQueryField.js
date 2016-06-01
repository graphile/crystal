import { memoize } from 'lodash'
import { GraphQLNonNull, GraphQLID } from 'graphql'
import { $$isViewer } from '../../symbols.js'
import { NodeType, fromID } from '../types.js'
import resolveTableSingle from '../resolveTableSingle.js'

const createNodeQueryField = schema => {
  const getTable = memoize(tableName => schema.catalog.getTable(schema.name, tableName))
  return {
    type: NodeType,
    description: 'Fetches an object given its globally unique `ID`.',

    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The `ID` of the node.',
      },
    },

    resolve: (source, args, context) => {
      const { id } = args

      // If the id is just `viewer`, we are trying to refetch the viewer node.
      if (id === 'viewer')
        return { [$$isViewer]: true }

      const { tableName, values } = fromID(id)
      const table = getTable(tableName)

      if (!table)
        throw new Error(`No table '${tableName}' in schema '${schema.name}'.`)

      return getResolveNode(table)({ values }, {}, context)
    },
  }
}

export default createNodeQueryField

// This function will be called for every resolution, therefore it is (and
// must be) memoized.
//
// Because this is memoized, fetching primary keys is ok here.
const getResolveNode = memoize(table => resolveTableSingle(
  table,
  table.getPrimaryKeys(),
  ({ values }) => values,
))
