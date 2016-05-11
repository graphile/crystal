import { fromPairs, ary, assign } from 'lodash'
import { GraphQLObjectType } from 'graphql'
import createNodeQueryField from './createNodeQueryField.js'
import createTableQueryFields from './createTableQueryFields.js'
import createProcedureQueryField from './createProcedureQueryField.js'

/**
 * Creates the Query type for the entire schema. To see the fields created for
 * singular tables refer to `createQueryFields`.
 *
 * @param {Schema} schema
 * @returns {GraphQLObjectType}
 */
const createQueryType = schema =>
  new GraphQLObjectType({
    name: 'Query',
    description: schema.description || 'The entry type for GraphQL queries.',
    fields: {
      // Add the node query field.
      node: createNodeQueryField(schema),
      // Add fields for procedures.
      ...fromPairs(
        schema
        .getProcedures()
        .filter(({ isMutation }) => !isMutation)
        .filter(procedure => !procedure.hasTableArg())
        .map(procedure => [procedure.getFieldName(), createProcedureQueryField(procedure)])
      ),
      // Add the table query fields.
      ...(
        schema
        .getTables()
        .map(table => createTableQueryFields(table))
        .reduce(ary(assign, 2), {})
      ),
    },
  })

export default createQueryType
