import { GraphQLOutputType, GraphQLInputType } from 'graphql'
import BuildToken from '../../../graphql/schema/BuildToken'
import getGqlInputType from '../../../graphql/schema/type/getGqlInputType'
import getGqlOutputType from '../../../graphql/schema/type/getGqlOutputType'
import { PgCatalog, PgCatalogNamespace, PgCatalogType, PgCatalogProcedure } from '../../../postgres/introspection'
import getTypeFromPgType from '../../../postgres/inventory/type/getTypeFromPgType'
import PgType from '../../../postgres/inventory/type/PgType'

export type PgProcedureFixtures =  {
  pgCatalog: PgCatalog,
  pgProcedure: PgCatalogProcedure,
  pgNamespace: PgCatalogNamespace,
  args: Array<{
    name: string,
    pgType: PgCatalogType,
    type: PgType<mixed>,
    gqlType: GraphQLInputType,
    fromGqlInput: (gqlInput: mixed) => mixed,
  }>,
  return: {
    pgType: PgCatalogType,
    type: PgType<mixed>,
    gqlType: GraphQLOutputType,
    intoGqlOutput: (value: mixed) => mixed,
  },
}

/**
 * Creates some signature fixtures for a Postgres procedure. Contains the
 * Postgres type, the interface type, and the GraphQL type for all of the
 * arguments and the return type.
 *
 * Generally these fixtures would just be class instance members, but sense we
 * aren’t going through an interface here we need to create/share fixtures some
 * other way.
 */
export default function createPgProcedureFixtures (
  buildToken: BuildToken,
  pgCatalog: PgCatalog,
  pgProcedure: PgCatalogProcedure,
): PgProcedureFixtures {
  const { inventory } = buildToken
  return {
    pgCatalog,
    pgProcedure,
    pgNamespace: pgCatalog.assertGetNamespace(pgProcedure.namespaceId),

    // Convert our args into their appropriate forms, also in this we create
    // the argument name if it does not exist.
    args: pgProcedure.argTypeIds.map((typeId, i) => {
      const name = pgProcedure.argNames[i] || `arg-${i}`
      const pgType = pgCatalog.assertGetType(typeId)
      const type = getTypeFromPgType(pgCatalog, pgType, inventory)
      return { name, pgType, type, ...getGqlInputType(buildToken, type) }
    }),

    return: (() => {
      // Convert our return type into its appropriate forms.
      const pgType = pgCatalog.assertGetType(pgProcedure.returnTypeId)
      const type = getTypeFromPgType(pgCatalog, pgType, inventory)
      return { pgType, type, ...getGqlOutputType(buildToken, type) }
    })(),
  }
}
