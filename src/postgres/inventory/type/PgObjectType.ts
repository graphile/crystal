import { ObjectType } from '../../../interface'
import { PgCatalog, PgCatalogAttribute } from '../../introspection'

type PgRow = {
  [key: string]: mixed,
}

class PgObjectType implements ObjectType<PgRow> {
  public readonly kind: 'OBJECT' = 'OBJECT'
}

namespace PgObjectType {
  /**
   * The Postgres object type will add a `PgCatalogAttribute` to its fields for
   * future reference.
   */
  export interface Field<TObjectValue, TValue> extends ObjectType.Field<TObjectValue, TValue> {
    readonly pgAttribute: PgCatalogAttribute
  }
}


export default PgObjectType
