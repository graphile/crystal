import PgNullableType from '../../type/PgNullableType'
import PgListType from '../../type/PgListType'
import PgEnumType from '../../type/PgEnumType'
import pgStringType from '../../type/scalar/pgStringType'
import sql from '../../../utils/sql'

test('will work with enum lists', () => {
  const uSStateType = new PgEnumType({
    name: 'us_states',
    description: 'The 50 U.S. states',
    variants: new Set(['ALABAMA', 'ALASKA', 'ARIZONA', 'ARKANSAS', 'CALIFORNIA', 'COLORADO', 'CONNECTICUT', 'DELAWARE', 'FLORIDA', 'GEORGIA', 'HAWAII', 'IDAHO', 'ILLINOIS', 'INDIANA', 'IOWA', 'KANSAS', 'KENTUCKY', 'LOUISIANA', 'MAINE', 'MARYLAND', 'MASSACHUSETTS', 'MICHIGAN', 'MINNESOTA', 'MISSISSIPPI', 'MISSOURI', 'MONTANA', 'NEBRASKA', 'NEVADA', 'NEW HAMPSHIRE', 'NEW JERSEY', 'NEW MEXICO', 'NEW YORK', 'NORTH CAROLINA', 'NORTH DAKOTA', 'OHIO', 'OKLAHOMA', 'OREGON', 'PENNSYLVANIA', 'RHODE ISLAND', 'SOUTH CAROLINA', 'SOUTH DAKOTA', 'TENNESSEE', 'TEXAS', 'UTAH', 'VERMONT', 'VIRGINIA', 'WASHINGTON', 'WEST VIRGINIA', 'WISCONSIN', 'WYOMING']),
  })

  const uSStateListType = new PgListType(uSStateType)
  expect(sql.compile(uSStateListType.transformValueIntoPgValue(['CALIFORNIA', 'OREGON'])).text).toEqual('array[$1, $2]::\"us_states\"[]')

  const nullableUSStateListType = new PgListType(new PgNullableType(uSStateType))
  expect(sql.compile(nullableUSStateListType.transformValueIntoPgValue(['CALIFORNIA', 'OREGON'])).text).toEqual('array[$1, $2]::\"us_states\"[]')
})

test('will work with text lists', () => {
  const stringListType = new PgListType(pgStringType)
  expect(sql.compile(stringListType.transformValueIntoPgValue(['string1', 'string2'])).text).toEqual('array[$1, $2]::\"text\"[]')

  const nullableStringListType = new PgListType(new PgNullableType(pgStringType))
  expect(sql.compile(nullableStringListType.transformValueIntoPgValue(['string1', 'string2'])).text).toEqual('array[$1, $2]::\"text\"[]')
})
