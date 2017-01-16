import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
} from 'graphql'
import { formatName, buildObject } from '../utils'
import BuildToken from './BuildToken'
import createMutationPayloadGqlType from './createMutationPayloadGqlType'

/**
 * The configuration for creating a mutation field.
 *
 * @private
 */
type MutationFieldConfig<T> = {
  name: string,
  description?: string | undefined,
  inputFields?: Array<[string, GraphQLInputFieldConfig] | false | null | undefined>,
  outputFields?: Array<[string, GraphQLFieldConfig<T, mixed>] | false | null | undefined>,
  payloadType?: GraphQLObjectType,
  execute: (context: mixed, input: { [name: string]: mixed }) => Promise<T>,
}

/**
 * The internal value of a mutation.
 */
export type MutationValue<T> = {
  clientMutationId?: string,
  value: T,
}

/**
 * Creates a mutation field that is Relay 1 compatible. Since virtually every
 * mutation in our system is of a similar form, having a utility function to
 * create mutations is helpful.
 *
 * Inspiration was taken from `mutationWithClientMutationId` in
 * [`graphql-relay`][1].
 *
 * [1]: https://www.npmjs.com/package/graphql-relay
 */
export default function createMutationGqlField <T>(
  buildToken: BuildToken,
  config: MutationFieldConfig<T>,
): GraphQLFieldConfig<mixed, MutationValue<T>> {
  if (config.outputFields && config.payloadType)
    throw new Error('Mutation `outputFields` and `payloadType` may not be defiend at the same time.')

  return {
    description: config.description,

    // First up we need to define our input arguments. Our input arguments is
    // really just one required object argument. The reason we use one object
    // is so that clients can use a single GraphQL variable when performing the
    // mutation (it’s a Relay 1 that happens to be a good idea, as many are).
    args: {
      input: {
        description: 'The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.',
        type: new GraphQLNonNull(new GraphQLInputObjectType({
          name: formatName.type(`${config.name}-input`),
          description: `All input for the \`${formatName.field(config.name)}\` mutation.`,
          fields: buildObject<GraphQLInputFieldConfig>(
            [
              // Relay 1 requires us to have a `clientMutationId`. This can be
              // helpful for tracking the results of mutations.
              ['clientMutationId', {
                description: 'An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client.',
                type: GraphQLString,
              }],
            ],
            // Add all of our input fields to the input object verbatim. No
            // transforms.
            (config.inputFields || []).filter(Boolean),
          ),
        })),
      },
    },

    // Next we need to define our output (payload) type. Instead of directly
    // being a value, we instead return an object. This allows us to return
    // multiple things. If we were directly given a payload type, however, we
    // will just use that.
    type:
      config.payloadType
        ? config.payloadType
        : createMutationPayloadGqlType(buildToken, config),

    // Finally we define the resolver for this field which will actually
    // execute the mutation. Basically it will just include the
    // `clientMutationId` in the payload, and calls `config.execute`.
    async resolve (_source, args, context): Promise<MutationValue<T>> {
      const { clientMutationId } = args['input']
      const value = await config.execute(context, args['input'])

      return {
        clientMutationId,
        value,
      }
    },
  }
}
