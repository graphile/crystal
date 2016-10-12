import { PGCatalog, PGCatalogClass, PGCatalogCompositeType, PGCatalogAttribute } from '../../introspection'
import PGObjectType from './PGObjectType'

/**
 * A custom Postgres class object type which extends `PGObjectType`. Provides a
 * clear interface when construction a type using a class and exposes the
 * `PGCatalogClass` as a property. That last bit is helpful for procedures.
 */
// TODO: Refactor how we handle Postgres types entirely.
class PGClassObjectType extends PGObjectType {
  constructor (
    pgCatalog: PGCatalog,
    pgClass: PGCatalogClass,
    config: { name?: string, renameIdToRowId?: boolean } = {},
  ) {
    const pgType = pgCatalog.assertGetType(pgClass.typeId)
    super({
      name: config.name || pgClass.name || pgType.name,
      description: pgClass.description || pgType.description,
      pgCatalog,
      pgAttributes: new Map(
        pgCatalog.getClassAttributes(pgClass.id).map<[string, PGCatalogAttribute]>(pgAttribute =>
          [config.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name, pgAttribute]
        )),
    })
    this.pgClass = pgClass
    this.pgType = pgCatalog.assertGetType(pgClass.typeId) as PGCatalogCompositeType
  }

  public pgClass: PGCatalogClass
  public pgType: PGCatalogCompositeType
}

export default PGClassObjectType
