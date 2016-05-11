import { memoize } from 'lodash'
import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import createQueryFields from './query/createQueryFields.js'

const createViewerField = memoize(schema => ({
  type: new GraphQLNonNull(new GraphQLObjectType({
    name: 'Viewer',
    description: '',
    fields: createQueryFields(schema),
  })),

  description:
    'A single entry query for advanced data clients like Relay. Nothing ' +
    'special at all, if you don’t know what this field is for, you probably ' +
    'don’t need it.',

  resolve: source => source || {},
}))

export default createViewerField
