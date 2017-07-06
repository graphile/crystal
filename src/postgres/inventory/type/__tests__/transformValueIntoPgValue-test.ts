import PgNullableType from '../../type/PgNullableType'
import PgListType from '../../type/PgListType'
import PgEnumType from '../../type/PgEnumType'
import pgStringType from '../../type/scalar/pgStringType'
import sql from '../../../utils/sql'

test('will work with enum lists', () => {
  const USStateType = new PgEnumType({
    name: 'us_states',
    description: 'The 50 U.S. states',
    variants: new Set(['ALABAMA','ALASKA','ARIZONA','ARKANSAS','CALIFORNIA','COLORADO','CONNECTICUT','DELAWARE','FLORIDA','GEORGIA','HAWAII','IDAHO','ILLINOIS','INDIANA','IOWA','KANSAS','KENTUCKY','LOUISIANA','MAINE','MARYLAND','MASSACHUSETTS','MICHIGAN','MINNESOTA','MISSISSIPPI','MISSOURI','MONTANA','NEBRASKA','NEVADA','NEW HAMPSHIRE','NEW JERSEY','NEW MEXICO','NEW YORK','NORTH CAROLINA','NORTH DAKOTA','OHIO','OKLAHOMA','OREGON','PENNSYLVANIA','RHODE ISLAND','SOUTH CAROLINA','SOUTH DAKOTA','TENNESSEE','TEXAS','UTAH','VERMONT','VIRGINIA','WASHINGTON','WEST VIRGINIA','WISCONSIN','WYOMING'])
  })

  const USStateListType = new PgListType(USStateType)
  expect(sql.compile(USStateListType.transformValueIntoPgValue(['CALIFORNIA','OREGON'])).text).toEqual('array[$1, $2]::\"us_states\"[]')

  const NullableUSStateListType = new PgListType(new PgNullableType(USStateType))
  expect(sql.compile(NullableUSStateListType.transformValueIntoPgValue(['CALIFORNIA','OREGON'])).text).toEqual('array[$1, $2]::\"us_states\"[]')
})

test('will work with text lists', () => {
  const StringListType = new PgListType(pgStringType)
  expect(sql.compile(StringListType.transformValueIntoPgValue(['string1','string2'])).text).toEqual('array[$1, $2]::\"text\"[]')

  const NullableStringListType = new PgListType(new PgNullableType(pgStringType))
  expect(sql.compile(NullableStringListType.transformValueIntoPgValue(['string1','string2'])).text).toEqual('array[$1, $2]::\"text\"[]')
})
