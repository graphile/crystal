import { fromPairs, camelCase, snakeCase, upperFirst, toUpper } from 'lodash'
import { CursorType } from '../connection/types.js'
import createConnectionType from '../connection/createConnectionType.js'
import resolveTableList from './resolveTableList.js'

import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql'

const pascalCase = string => upperFirst(camelCase(string))

/**
 * Gets the Relay connection specification compliant list field for a `Table`.
 *
 * @param {Table} table
 * @returns {GraphQLFieldConfig}
 */
const createTableListField = table => ({
  description:
    'Queries and returns a list of items with some metatadata for ' +
    `\`${pascalCase(table.name)}\`. Note that cursors will not work across ` +
    'different `orderBy` values. If you want to reuse a cursor, make sure ' +
    'you don’t change `orderBy`.',

  args: {
    // The column specified by `orderBy` means more than just the order to
    // return items in. This column is also the column we will use for
    // cursors.
    orderBy: {
      type: createTableOrderingEnum(table),
      description:
        'The order the resulting items should be returned in. This argument ' +
        'is also very important as it is used to determine which field will be ' +
        'used as the pagination cursor. This value’s default will be the ' +
        'primary key for the object.',
      defaultValue: (() => {
        const column = table.getPrimaryKeyColumns()[0]
        if (column) return column.name
        return null
      })(),
    },
    first: {
      type: GraphQLInt,
      description:
        'The top **n** items in the collection to be returned. Can’t be used ' +
        'with `last`.',
    },
    last: {
      type: GraphQLInt,
      description:
        'The bottom **n** items in the collection to be returned. Can’t be used ' +
        'with `first`.',
    },
    before: {
      type: CursorType,
      description: 'The collection returned will be constrained to all items **before** the provided cursor.',
    },
    after: {
      type: CursorType,
      description: 'The collection returned will be constrained to all items **after** the provided cursor.',
    },
    offset: {
      type: GraphQLInt,
      description: 'An integer offset representing how many items to skip before returning the values.',
    },
    descending: {
      type: GraphQLBoolean,
      description:
        'If `true` the items will be in descending order, if `false` the ' +
        'items will be in ascending order.',
      defaultValue: false,
    },
  },

  // Make sure the type of this field is our connection type. This connection
  // type will expect functions (that cache their values) and not traditional
  // values. This improves performance when we don’t have to do potentially
  // expensive queries on fields we don’t actually need.
  type: createConnectionType(table),

  resolve: resolveTableList(table),
})

export default createTableListField

/**
 * Creates an ordering enum which simply contains all of a `Table`s columns.
 *
 * @param {Table} table
 * @returns {GraphQLEnumType}
 */
// TODO: Some way to eliminate some columns from ordering enum?
const createTableOrderingEnum = table =>
  new GraphQLEnumType({
    name: pascalCase(`${table.name}_ordering`),
    description: `Properties with which \`${pascalCase(table.name)}\` can be ordered.`,

    values: fromPairs(
      table.columns
      .map(({ name }) => [toUpper(snakeCase(name)), { value: name }])
    ),
  })
