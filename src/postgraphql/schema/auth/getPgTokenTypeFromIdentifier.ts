import { PgCatalog, PgCatalogCompositeType } from '../../../postgres/introspection'

/**
 * Gets the Postgres token type from a type identifier (namespace name and type
 * name). Also does some checks on the type to make sure it is an acceptable
 * token type.
 */
export default function getPgTokenTypeFromIdentifier (
  pgCatalog: PgCatalog,
  jwtPgTypeIdentifier: string,
): PgCatalogCompositeType {
  const { namespaceName, typeName } = parseTypeIdentifier(jwtPgTypeIdentifier)

  // Try to get the type from our catalog by name.
  const pgType = pgCatalog.getTypeByName(namespaceName, typeName)

  // If a type with the provided name does not exist, throw an error.
  if (!pgType)
    throw new Error(`Postgres token type "${namespaceName}"."${typeName}" does not exist in your Postgres schema subset. Perhaps try adding schema "${namespaceName}" to your list of introspected queries.`)

  // If the token type is not a composite type, throw an error.
  if (pgType.type !== 'c')
    throw new Error(`Postgres token type "${namespaceName}"."${typeName}" is not a composite type.`)

  // Get the class, we want to run some checks…
  const pgClass = pgCatalog.assertGetClass(pgType.classId)

  // If the class is insertable, selectable, updatable, or deletable it is
  // likely a table or view. We only want our tokens to be compound types
  // (for now). Therefore, throw an error if we think this class is a table
  // or view.
  if (pgClass.isInsertable || pgClass.isSelectable || pgClass.isUpdatable || pgClass.isDeletable)
    throw new Error(`Postgres token type "${namespaceName}"."${typeName}" is a table or view. Only compound types are allowed to be tokens.`)

  // If we have gotten past all that, here is our type.
  return pgType
}

/**
 * Enables the parsing of type identifiers. Type identifiers are a bit tricky,
 * but this function uses a regular expression to do it. Fun.
 *
 * @private
 */
function parseTypeIdentifier (typeIdentifier: string): { namespaceName: string, typeName: string } {
  const match = typeIdentifier.match(/^(?:([a-zA-Z0-9_]+)|"([^"]*)")\.(?:([a-zA-Z0-9_]+)|"([^"]*)")$/)

  if (!match)
    throw new Error(`Type identifier '${typeIdentifier}' is of the incorrect form.`)

  return {
    namespaceName: match[1] || match[2],
    typeName: match[3] || match[4],
  }
}
