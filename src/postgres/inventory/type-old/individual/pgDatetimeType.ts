import { AliasType, stringType } from '../../../../interface'

// TOOD: Maybe this should be in the interface as a primitive?
const pgDatetimeType = new AliasType({
  name: 'datetime',
  description: 'A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.',
  baseType: stringType,
})

export default pgDatetimeType
