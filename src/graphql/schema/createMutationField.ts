import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInputFieldConfig,
} from 'graphql'
import { Context } from '../../interface'
import { formatName, buildObject } from '../utils'
import BuildToken from './BuildToken'
import getQueryType from './getQueryType'

/**
 * The configuration for creating a mutation field.
 *
 * @private
 */
type MutationFieldConfig<T> = {
  name: string,
  inputFields?: Array<[string, GraphQLInputFieldConfig<mixed>] | false | null | undefined>,
  outputFields?: Array<[string, GraphQLFieldConfig<T, mixed>] | false | null | undefined>,
  execute: (context: Context, input: { [name: string]: mixed }) => Promise<T | null | undefined>,
}

/**
 * The internal value of a mutation.
 *
 * @private
 */
type MutationValue<T> = {
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
export default function createMutationField <T>(
  buildToken: BuildToken,
  config: MutationFieldConfig<T>,
): GraphQLFieldConfig<mixed, MutationValue<T>> {
  return {
    // First up we need to define our input arguments. Our input arguments is
    // really just one required object argument. The reason we use one object
    // is so that clients can use a single GraphQL variable when performing the
    // mutation (it’s a Relay 1 that happens to be a good idea, as many are).
    args: {
      input: {
        // TODO: description
        type: new GraphQLNonNull(new GraphQLInputObjectType({
          name: formatName.type(`${config.name}-input`),
          // TODO: description
          fields: buildObject<GraphQLInputFieldConfig<mixed>>(
            [
              // Relay 1 requires us to have a `clientMutationId`. This can be
              // helpful for tracking the results of mutations.
              ['clientMutationId', {
                // TODO: description
                type: GraphQLString,
              }],
            ],
            // Add all of our input fields to the input object verbatim. No
            // transforms.
            (config.inputFields || []).filter(Boolean),
          ),
        }))
      },
    },

    // Next we need to define our output (payload) type. Instead of directly
    // being a value, we instead return an object. This allows us to return
    // multiple things.
    type: new GraphQLObjectType<MutationValue<T>>({
      name: formatName.type(`${config.name}-payload`),
      // TODO: description
      fields: buildObject<GraphQLFieldConfig<MutationValue<T>, mixed>>(
        [
          // Add the `clientMutationId` output field. This will be the exact
          // same value as the input `clientMutationId`.
          ['clientMutationId', {
            // TODO: description
            type: GraphQLString,
            resolve: ({ clientMutationId }) => clientMutationId,
          }],
        ],
        // Add all of our output fields to the output object verbatim. Simple
        // as that. We do transform the fields to mask the implementation
        // detail of `MutationValue` being an object. Instead we just pass
        // `MutationValue#value` directly to the resolver.
        (config.outputFields || [])
          .filter(Boolean)
          .map<[string, GraphQLFieldConfig<MutationValue<T>, mixed>]>(
            ([fieldName, field]: [string, GraphQLFieldConfig<T, mixed>]) =>
              [fieldName, <GraphQLFieldConfig<MutationValue<T>, mixed>> {
                type: field.type,
                args: field.args,
                resolve: field.resolve ? ({ value }: MutationValue<T>, ...rest: Array<any>) => (field as any).resolve(value, ...rest) : null,
                description: field.description,
                deprecationReason: field.deprecationReason,
              }]
          ),
        [
          // A reference to the root query type. Allows you to access even more
          // data in your mutations.
          ['query', {
            // TODO: description
            type: getQueryType(buildToken),
            resolve: () => null,
          }],
        ],
      ),
    }),

    // Finally we define the resolver for this field which will actually
    // execute the mutation. Basically it will just include the
    // `clientMutationId` in the payload, and calls `config.execute`.
    async resolve (source, args, context) {
      if (!(context instanceof Context))
        throw new Error('GraphQL context must be an instance of `Context`.')

      const { clientMutationId } = args['input']
      const value = await config.execute(context, args['input'])

      return {
        clientMutationId,
        value,
      }
    },
  }
}
