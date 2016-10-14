import { GraphQLOutputType, GraphQLInputType } from 'graphql'
import { Type } from '../../../interface'
import BuildToken from '../../../graphql/schema/BuildToken'
import getGQLType from '../../../graphql/schema/getGQLType'
import { PGCatalog, PGCatalogNamespace, PGCatalogType, PGCatalogProcedure } from '../../../postgres/introspection'
import getTypeFromPGType from '../../../postgres/inventory/type/getTypeFromPGType'

export type PGProcedureFixtures =  {
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
  pgNamespace: PGCatalogNamespace,
  args: Array<{
    name: string,
    pgType: PGCatalogType,
    type: Type<mixed>,
    gqlType: GraphQLInputType<mixed>,
  }>,
  return: {
    pgType: PGCatalogType,
    type: Type<mixed>,
    gqlType: GraphQLOutputType<mixed>,
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
export default function createPGProcedureFixtures (
  buildToken: BuildToken,
  pgCatalog: PGCatalog,
  pgProcedure: PGCatalogProcedure,
): PGProcedureFixtures {
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
      const type = getTypeFromPGType(pgCatalog, pgType, inventory)
      const gqlType = getGQLType(buildToken, type, true)
      return { name, pgType, type, gqlType }
    }),

    return: (() => {
      // Convert our return type into its appropriate forms.
      const pgType = pgCatalog.assertGetType(pgProcedure.returnTypeId)
      const type = getTypeFromPGType(pgCatalog, pgType, inventory)
      const gqlType = getGQLType(buildToken, type, false)
      return { pgType, type, gqlType }
    })(),
  }
}
