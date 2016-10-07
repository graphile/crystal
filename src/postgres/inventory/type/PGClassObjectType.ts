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
    public pgClass: PGCatalogClass,
    config: { name?: string, renameIdToRowId?: boolean } = {},
  ) {
    super({
      name: config.name || pgClass.name || pgCatalog.assertGetType(pgClass.typeId).name,
      description: pgClass.description || pgCatalog.assertGetType(pgClass.typeId).description,
      pgCatalog,
      pgAttributes: new Map(
        pgCatalog.getClassAttributes(pgClass.id).map<[string, PGCatalogAttribute]>(pgAttribute =>
          [config.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name, pgAttribute]
        )),
    })
  }
}

export default PGClassObjectType
