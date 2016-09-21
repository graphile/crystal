import { Relation } from '../../../interface'
import { PGCatalog, PGCatalogForeignKeyConstraint } from '../../introspection'
import PGObjectType from '../type/PGObjectType'
import PGCollection from './PGCollection'
import PGCollectionKey from './PGCollectionKey'

// TODO: This implementation is sketchy. Implement it better!
class PGRelation implements Relation<PGObjectType.Value> {
  constructor (
    public tailCollection: PGCollection,
    public headCollectionKey: PGCollectionKey,
    private _pgConstraint: PGCatalogForeignKeyConstraint,
  ) {}

  private _pgCatalog = this.tailCollection._pgCatalog
  private _pgTailAttributes = this._pgCatalog.getClassAttributes(this._pgConstraint.classId, this._pgConstraint.keyAttributeNums)
  private _tailFieldNames = this._pgTailAttributes.map(pgAttribute => this.tailCollection.type.getPGAttributeFieldName(pgAttribute)!)
  private _headFieldNames = Array.from(this.headCollectionKey.keyType.fields.keys())

  /**
   * Construct the name for this relation using the native Postgres foreign key
   * constraint attributes.
   */
  public readonly name = this._tailFieldNames.join('_and_')

  /**
   * Gets an instance of the head collection’s key type by just extracting some keys from
   */
  public getHeadKeyFromTailValue (value: PGObjectType.Value): PGObjectType.Value {
    return this._tailFieldNames.reduce((headKey, tailFieldName, i) => {
      headKey.set(this._headFieldNames[i], value.get(tailFieldName))
      return headKey
    }, new Map())
  }
}

export default PGRelation
