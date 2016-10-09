import { AliasType, stringType } from '../../../../interface'

const pgTimeType = new AliasType({
  name: 'time',
  description: 'The exact time of day, does not include the date. May or may not have a timezone offset.',
  baseType: stringType,
})

export default pgTimeType
