import { PGCatalog, PGCatalogClass, PGCatalogAttribute } from '../../introspection'
import PGObjectType from './PGObjectType'

/**
 * A custom Postgres class object type which extends `PGObjectType`. Provides a
 * clear interface when construction a type using a class and exposes the
 * `PGCatalogClass` as a property. That last bit is helpful for procedures.
 */
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
  }

  public pgClass: PGCatalogClass
}

export default PGClassObjectType
