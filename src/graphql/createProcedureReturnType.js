import { memoize } from 'lodash'
import { GraphQLList } from 'graphql'
import getType from './getType'

const createProcedureReturnType = memoize(procedure => {
  const returnType = getType(procedure.returnType)
  return procedure.returnsSet ? new GraphQLList(returnType) : returnType
})

export default createProcedureReturnType
