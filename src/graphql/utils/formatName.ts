import { camelCase, pascalCase, constantCase } from 'change-case'

const formatInsideUnderscores = (formatter: (name: string) => string) => (fullName: string) => {
  const [, start, name, finish] = /^(_*)(.*?)(_*)$/.exec(fullName)!
  return `${start}${formatter(name)}${finish}`
}

const camelCaseInsideUnderscores = formatInsideUnderscores(name => camelCase(name, undefined, true))
const pascalCaseInsideUnderscores = formatInsideUnderscores(name => pascalCase(name, undefined, true))
const constantCaseInsideUnderscores = formatInsideUnderscores(constantCase)

namespace formatName {
  /**
   * Formats a GraphQL type name using PascalCase.
   */
  export const type = pascalCaseInsideUnderscores

  /**
   * Formats a GraphQL field name using camelCase.
   */
  export const field = camelCaseInsideUnderscores

  /**
   * Formats a GraphQL argument name using camelCase.
   */
  export const arg = camelCaseInsideUnderscores

  /**
   * Formats a GraphQL enum value name using CONSTANT_CASE.
   */
  export const enumValue = constantCaseInsideUnderscores
}

export default formatName
