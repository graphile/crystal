import { memoize } from 'lodash'
import createViewerField from '../createViewerField.js'
import { payloadClientMutationId } from './clientMutationId.js'

const getPayloadFields = memoize(schema => ({
  clientMutationId: payloadClientMutationId,
  viewer: createViewerField(schema),
}))

export default getPayloadFields
