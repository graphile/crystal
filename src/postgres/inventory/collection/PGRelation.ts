import { Condition, conditionHelpers, Relation } from '../../../interface'
import { PGCatalog, PGCatalogForeignKeyConstraint } from '../../introspection'
import PGObjectType from '../type/PGObjectType'
import PGCollection from './PGCollection'
import PGCollectionKey from './PGCollectionKey'

// TODO: This implementation is sketchy. Implement it better!
// TODO: Tests
class PGRelation implements Relation<PGObjectType.Value> {
  constructor (
    public tailCollection: PGCollection,
    public headCollectionKey: PGCollectionKey,
    private _pgConstraint: PGCatalogForeignKeyConstraint,
  ) {}

  private _pgCatalog = this.tailCollection._pgCatalog
  private _pgTailAttributes = this._pgCatalog.getClassAttributes(this._pgConstraint.classId, this._pgConstraint.keyAttributeNums)
  private _tailFieldNames = this._pgTailAttributes.map(pgAttribute => this.tailCollection.type.getFieldNameFromPGAttributeName(pgAttribute.name)!)
  private _headFieldNames = Array.from(this.headCollectionKey.keyType.fields.keys())

  /**
   * Construct the name for this relation using the native Postgres foreign key
   * constraint attributes.
   */
  public readonly name = this._tailFieldNames.join('_and_')

  /**
   * Gets an instance of the head collection’s key type by just extracting some
   * keys from the tail value.
   */
  public getHeadKeyFromTailValue (tailValue: PGObjectType.Value): PGObjectType.Value {
    return this._tailFieldNames.reduce((headKey, tailFieldName, i) => {
      headKey.set(this._headFieldNames[i], tailValue.get(tailFieldName))
      return headKey
    }, new Map())
  }

  /**
   * Gets a condition from the head value which basically just requires that
   * the fields equal the right things.
   */
  public getTailConditionFromHeadValue (headValue: PGObjectType.Value): Condition {
    return conditionHelpers.and(...this._headFieldNames.map((headFieldName, i) =>
      conditionHelpers.fieldEquals(this._tailFieldNames[i], headValue.get(headFieldName))
    ))
  }
}

export default PGRelation
