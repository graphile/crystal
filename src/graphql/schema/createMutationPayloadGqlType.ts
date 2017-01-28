import { GraphQLString, GraphQLObjectType, GraphQLFieldConfig } from 'graphql'
import { formatName, buildObject } from '../utils'
import BuildToken from './BuildToken'
import { MutationValue } from './createMutationGqlField'
import getQueryGqlType, { $$isQuery } from './getQueryGqlType'

/**
 * Creates the payload type for a GraphQL mutation. Uses the provided output
 * fields and adds a `clientMutationId` and `query` field.
 */
export default function createMutationPayloadGqlType <TValue>(
  buildToken: BuildToken,
  config: {
    name: string,
    outputFields?: Array<[string, GraphQLFieldConfig<TValue, mixed>] | false | null | undefined>,
  },
): GraphQLObjectType {
  return new GraphQLObjectType({
    name: formatName.type(`${config.name}-payload`),
    description: `The output of our \`${formatName.field(config.name)}\` mutation.`,
    fields: buildObject<GraphQLFieldConfig<MutationValue<TValue>, mixed>>(
      [
        // Add the `clientMutationId` output field. This will be the exact
        // same value as the input `clientMutationId`.
        ['clientMutationId', {
          description: `The exact same \`clientMutationId\` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations.`,
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
        .map<[string, GraphQLFieldConfig<MutationValue<TValue>, mixed>]>(
          ([fieldName, field]: [string, GraphQLFieldConfig<TValue, mixed>]) =>
            [fieldName, {
              type: field.type,
              args: field.args,
              resolve:
                field.resolve
                  ? ({ value }: MutationValue<TValue>, ...rest: Array<mixed>) =>
                    // tslint:disable-next-line no-any
                    (field as any).resolve(value, ...rest)
                  : null,
              description: field.description,
              deprecationReason: field.deprecationReason,
            } as GraphQLFieldConfig<MutationValue<TValue>, mixed>],
        ),
      [
        // A reference to the root query type. Allows you to access even more
        // data in your mutations.
        ['query', {
          description: 'Our root query field type. Allows us to run any query from our mutation payload.',
          type: getQueryGqlType(buildToken),
          resolve: () => $$isQuery,
        }],
      ],
    ),
  })
}
