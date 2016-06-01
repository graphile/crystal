import { memoize } from 'lodash'
import { GraphQLObjectType, GraphQLNonNull, GraphQLID } from 'graphql'
import { $$isViewer } from '../symbols.js'
import { NodeType } from './types'
import createQueryFields from './query/createQueryFields.js'

const createViewerField = memoize(schema => ({
  type: new GraphQLNonNull(new GraphQLObjectType({
    name: 'Viewer',
    description: 'The viewer type, provides a “view” into your data. To be used with Relay.',
    interfaces: [NodeType],
    isTypeOf: value => value[$$isViewer],
    fields: {
      ...createQueryFields(schema),
      id: {
        type: GraphQLID,
        description:
          'An identifier for the viewer node. Just the plain string “viewer.” ' +
          'Can be used to refetch the viewer object in the `node` field. This ' +
          'is required for Relay.',

        resolve: () => 'viewer',
      },
    },
  })),

  description:
    'A single entry query for the advanced data client Relay. Nothing ' +
    'special at all, if you don’t know what this field is for, you probably ' +
    'don’t need it.',

  resolve: () => ({ [$$isViewer]: true }),
}))

export default createViewerField
