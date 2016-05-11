import { constant, fromPairs, camelCase } from 'lodash'
import { GraphQLNonNull } from 'graphql'
import getType from './getType.js'

const createProcedureArgs = (procedure, omitArg = constant(false)) => fromPairs(
  // For all of our argument types, make a key/value pair which will
  // eventually be transformed into a GraphQL argument object. We use the
  // name from `argNames` and the type from `argTypes` (we also assume they
  // are arrays of equal lengths). If the procedure is marked as strict, all
  // arguments also must be required.
  Array
  .from(procedure.args)
  .filter(argEntry => !omitArg(...argEntry))
  .map(([name, type]) => [camelCase(name), {
    type: procedure.isStrict ?
      new GraphQLNonNull(getType(type)) :
      getType(type),
  }])
)

export default createProcedureArgs
