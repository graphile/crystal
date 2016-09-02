import { camelCase, pascalCase, constantCase } from 'change-case'

const formatInsideUnderscores = (formatter: (string: string) => string) => (string: string) => {
  const [, start, name, finish] = /^(_*)(.*?)(_*)$/.exec(string)!
  return `${start}${formatter(name)}${finish}`
}

const camelCaseInsideUnderscores = formatInsideUnderscores(camelCase)
const pascalCaseInsideUnderscores = formatInsideUnderscores(pascalCase)
const constantCaseInsideUnderscores = formatInsideUnderscores(constantCase)

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
