import { memoize } from 'lodash'
import { GraphQLNonNull } from 'graphql'
import getType from './getType.js'

const getColumnType = memoize(({ isNullable, type }) => (
  isNullable ? getType(type) : new GraphQLNonNull(getType(type))
))

export default getColumnType
