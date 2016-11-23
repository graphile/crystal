import { Condition, conditionHelpers, Relation } from '../../../interface'
import { PgCatalog, PgCatalogAttribute, PgCatalogForeignKeyConstraint } from '../../introspection'
import PgObjectType from '../type/PgObjectType'
import PgCollection from './PgCollection'
import PgCollectionKey from './PgCollectionKey'

// TODO: This implementation is sketchy. Implement it better!
// TODO: Tests
class PgRelation implements Relation<PgObjectType.Value> {
  constructor (
    public tailCollection: PgCollection,
    public headCollectionKey: PgCollectionKey,
    public pgConstraint: PgCatalogForeignKeyConstraint,
  ) {}

  private _pgCatalog: PgCatalog = this.tailCollection._pgCatalog
  private _pgTailAttributes: Array<PgCatalogAttribute> = this._pgCatalog.getClassAttributes(this.pgConstraint.classId, this.pgConstraint.keyAttributeNums)
  private _tailFieldNames: Array<string> = this._pgTailAttributes.map(pgAttribute => this.tailCollection.type.getFieldNameFromPgAttributeName(pgAttribute.name)!)
  private _headFieldNames: Array<string> = Array.from(this.headCollectionKey.keyType.fields.keys())

  /**
   * Construct the name for this relation using the native Postgres foreign key
   * constraint attributes.
   */
  public readonly name: string = this._tailFieldNames.join('_and_')

  /**
   * Gets an instance of the head collection’s key type by just extracting some
   * keys from the tail value.
   */
  public getHeadKeyFromTailValue (tailValue: PgObjectType.Value): PgObjectType.Value {
    return this._tailFieldNames.reduce((headKey, tailFieldName, i) => {
      headKey.set(this._headFieldNames[i], tailValue.get(tailFieldName))
      return headKey
    }, new Map())
  }

  /**
   * Gets a condition from the head value which basically just requires that
   * the fields equal the right things.
   */
  public getTailConditionFromHeadValue (headValue: PgObjectType.Value): Condition {
    return conditionHelpers.and(...this._headFieldNames.map((headFieldName, i) =>
      conditionHelpers.fieldEquals(this._tailFieldNames[i], headValue.get(headFieldName)),
    ))
  }
}

export default PgRelation
