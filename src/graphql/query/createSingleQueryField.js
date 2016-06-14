import { fromPairs } from 'lodash'
import { GraphQLNonNull, getNullableType } from 'graphql'
import createTableType from '../createTableType.js'
import getColumnType from '../getColumnType.js'
import resolveTableSingle from '../resolveTableSingle.js'

const createSingleQueryField = (table, columns) => ({
  type: createTableType(table),
  description:
    `Queries a single ${table.getMarkdownTypeName()} using a uniqueness ` +
    `constraint with field${columns.length === 1 ? '' : 's'} ` +
    `${columns.map(column => column.getMarkdownFieldName()).join(', ')}.`,

  args: fromPairs(
    columns.map(column => [column.getFieldName(), {
      type: new GraphQLNonNull(getNullableType(getColumnType(column))),
      description: `The exact value of the ${column.getMarkdownFieldName()} field to match.`,
    }])
  ),

  resolve: resolveTableSingle(
    table,
    columns,
    (source, args) => columns.map(column => args[column.getFieldName()])
  ),
})

export default createSingleQueryField
