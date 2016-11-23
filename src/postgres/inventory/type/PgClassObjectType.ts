import { PgCatalog, PgCatalogClass, PgCatalogCompositeType, PgCatalogAttribute } from '../../introspection'
import PgObjectType from './PgObjectType'

/**
 * A custom Postgres class object type which extends `PgObjectType`. Provides a
 * clear interface when construction a type using a class and exposes the
 * `PgCatalogClass` as a property. That last bit is helpful for procedures.
 */
// TODO: Refactor how we handle Postgres types entirely.
class PgClassObjectType extends PgObjectType {
  constructor (
    pgCatalog: PgCatalog,
    pgClass: PgCatalogClass,
    config: { name?: string, renameIdToRowId?: boolean } = {},
  ) {
    const pgType = pgCatalog.assertGetType(pgClass.typeId)
    super({
      name: config.name || pgClass.name || pgType.name,
      description: pgClass.description || pgType.description,
      pgCatalog,
      pgAttributes: new Map(
        pgCatalog.getClassAttributes(pgClass.id).map<[string, PgCatalogAttribute]>(pgAttribute =>
          [config.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name, pgAttribute],
        )),
    })
    this.pgClass = pgClass
    this.pgType = pgCatalog.assertGetType(pgClass.typeId) as PgCatalogCompositeType
  }

  public pgClass: PgCatalogClass
  public pgType: PgCatalogCompositeType
}

export default PgClassObjectType
