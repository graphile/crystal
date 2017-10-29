import { camelCase, pascalCase, constantCase } from 'change-case'
import FormatName from '../../schema/FormatName'

const formatInsideUnderscores = (formatter: (name: string) => string) => (fullName: string) => {
  const [, start, name, finish] = /^(_*)(.*?)(_*)$/.exec(fullName)!
  return `${start}${formatter(name)}${finish}`
}

const camelCaseInsideUnderscores = formatInsideUnderscores(name => camelCase(name, undefined, true))
const pascalCaseInsideUnderscores = formatInsideUnderscores(name => pascalCase(name, undefined, true))
const constantCaseInsideUnderscores = formatInsideUnderscores(constantCase)

const formatName: FormatName = {
  type: pascalCaseInsideUnderscores,
  field: camelCaseInsideUnderscores,
  arg: camelCaseInsideUnderscores,
  enumValue: constantCaseInsideUnderscores,

  queryAllMethod: (collectionType: string): string => camelCaseInsideUnderscores(`all_${collectionType}`),
  queryAllOrderByType: (collectionType: string): string =>  pascalCaseInsideUnderscores(`${collectionType}_order_by`),
  queryAllEdgeType: (collectionType: string): string =>  pascalCaseInsideUnderscores(`${collectionType}_edge`),
  queryAllRelationType: (collectionType: string): string =>  pascalCaseInsideUnderscores(`${collectionType}_connection`),
  queryAllConditionType: (collectionType: string): string =>  pascalCaseInsideUnderscores(`${collectionType}_condition`),
  queryAllEdgeFieldName: (collectionType: string): string =>  camelCaseInsideUnderscores(`${collectionType}_edge`),

  queryMethod: camelCaseInsideUnderscores,
  queryByKeyMethod: (collectionType: string, key: string): string => camelCaseInsideUnderscores(`${collectionType}_by_${key}`),
  queryRelationField: camelCaseInsideUnderscores,
  queryRelationFieldByKeyMethod: (collectionType: string, key: string): string => camelCaseInsideUnderscores(`${collectionType}_by_${key}`),

  deleteMethod: (collectionType: string): string => camelCaseInsideUnderscores(`delete_${collectionType}`),
  deleteType: (collectionType: string): string => pascalCaseInsideUnderscores(`delete_${collectionType}`),
  deleteByKeyMethod: (collectionType: string, key: string): string =>  camelCase(`delete_${collectionType}_by_${key}`),
  deletedID: (collectionType: string): string =>  camelCaseInsideUnderscores(`deleted_${collectionType}_id`),

  mutationPayload: (collectionType: string): string =>  pascalCaseInsideUnderscores(`${collectionType}_payload`),

  createType: (collectionType: string): string =>  pascalCaseInsideUnderscores(`${collectionType}_input`),
  createMethod: (collectionType: string): string => camelCaseInsideUnderscores(`create_${collectionType}`),

  updateMethod: (fieldName: string): string => camelCaseInsideUnderscores(`update_${fieldName}`),
  updateType: (collectionType: string): string =>  pascalCaseInsideUnderscores(`update_${collectionType}`),
  updateByKeyMethod: (collectionType: string, key: string): string =>  pascalCaseInsideUnderscores(`update_${collectionType}_by_${key}`),
  updatePatchType: (collectionType: string): string => pascalCaseInsideUnderscores(`${collectionType}-patch`),
  updatePatchField: (fieldName: string): string => camelCaseInsideUnderscores(`${fieldName}_patch`),
}

export default formatName
