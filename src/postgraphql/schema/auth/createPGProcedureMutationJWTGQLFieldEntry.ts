import jwt = require('jsonwebtoken')
import { GraphQLNonNull, GraphQLFieldConfig, GraphQLInputFieldConfig, getNullableType } from 'graphql'
import { formatName } from '../../../graphql/utils'
import BuildToken from '../../../graphql/schema/BuildToken'
import createMutationGQLField from '../../../graphql/schema/createMutationGQLField'
import transformGQLInputValue from '../../../graphql/schema/transformGQLInputValue'
import { sql } from '../../../postgres/utils'
import { PGCatalog, PGCatalogProcedure } from '../../../postgres/introspection'
import pgClientFromContext from '../../../postgres/inventory/pgClientFromContext'
import createPGProcedureFixtures from '../procedures/createPGProcedureFixtures'
import createPGProcedureSQLCall from '../procedures/createPGProcedureSQLCall'
import GraphQLJWT from './GraphQLJWT'

/**
 * Creates a single mutation GraphQL field entry for our procedure. We use the
 * `createMutationGQLField` utility from the `graphql` package to do so.
 */
// TODO: test, TESTS
// TODO: This is like a copy paste of `createPGProcedureMutationGQLFieldEntry`.
// Refactor?
export default function createPGProcedureMutationJWTGQLFieldEntry (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
  jwtSecret: string,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const fixtures = createPGProcedureFixtures(buildToken, pgCatalog, pgProcedure)

  // Create our GraphQL input fields users will use to input data into our
  // procedure.
  const inputFields = fixtures.args.map<[string, GraphQLInputFieldConfig<mixed>]>(
    ({ name, gqlType }) =>
      [formatName.field(name), {
        // TODO: description
        type: pgProcedure.isStrict ? new GraphQLNonNull(getNullableType(gqlType)) : gqlType,
      }]
  )

  return [formatName.field(pgProcedure.name), createMutationGQLField<string>(buildToken, {
    name: pgProcedure.name,
    description: pgProcedure.description,

    inputFields,

    outputFields: [
      // The only output field is our JSON Web Token.
      ['token', {
        type: GraphQLJWT,
        resolve: value => value,
      }],
    ],

    // Actually execute the procedure here.
    async execute (context, gqlInput): Promise<string> {
      const client = pgClientFromContext(context)

      // Turn our GraphQL input into an input tuple.
      const input = inputFields.map(([fieldName, { type }]) => transformGQLInputValue(type, gqlInput[fieldName]))

      // Craft our procedure call. A procedure name with arguments, like any
      // other function call. Input values must be coerced twice however.
      const procedureCall = createPGProcedureSQLCall(fixtures, input)
      const query = sql.compile(sql.query`select to_json(${procedureCall}) as value`)
      const { rows: [row] } = await client.query(query)
      const value = row ? row['value'] : null

      // Sign our token to actually create the JWT and return it.
      return jwt.sign(value, jwtSecret, {
        audience: 'postgraphql',
        issuer: 'postgraphql',
        expiresIn: value['exp'] ? undefined : '1 day',
      })
    },
  })]
}
