import { fromPairs, upperFirst, camelCase } from 'lodash'
import createConnectionType from './createConnectionType.js'
import createConnectionArgs from './createConnectionArgs.js'
import resolveConnection from './resolveConnection.js'

const pascalCase = string => upperFirst(camelCase(string))

const createForeignKeyReverseField = ({ nativeTable, nativeColumns, foreignTable, foreignColumns }) => ({
  type: createConnectionType(nativeTable),
  description:
    `Queries and returns a connection of \`${pascalCase(nativeTable.name)}\` ` +
    `items that are related to the \`${pascalCase(foreignTable.name)}\` source ` +
    'node.',

  args: createConnectionArgs(nativeTable, nativeColumns),

  resolve: resolveConnection(
    nativeTable,
    source => fromPairs(foreignColumns.map(({ name }, i) => [nativeColumns[i].name, source[name]]))
  ),
})

export default createForeignKeyReverseField
