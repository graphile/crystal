/**
 * A utility function for requiring all files in a provided directory
 * Returns an array of double dimensions, as expected by mutationEntries
 */

import {  GraphQLFieldConfig } from 'graphql'
import postgraphql from '../../postgraphql/postgraphql'
const requireGlob = require('require-glob')

let initialized = false
const queries: Array<[string, GraphQLFieldConfig<never, mixed>]> = []
const mutations: Array<[string, GraphQLFieldConfig<never, mixed>]> = []

// Sync method to read the injections, populates our injections array
function initInjections(dirToInject: string): void {

  const files: Array<{ type: string, name: string, schema: (object: {}) => GraphQLFieldConfig<never, mixed> }> = []

  requireGlob.sync(dirToInject, {
    cwd: process.cwd(),
    reducer (_options: {}, tree: {} , file: {exports: { type: string, name: string, schema: (object: {}) => GraphQLFieldConfig<never, mixed>}}): {} {
      files.push({type: file.exports.type, name: file.exports.name, schema: file.exports.schema})
      return tree
    },
  })

  // Resolve each injection to get schema and validate type.
  files.forEach(file => {

    if (file.type === 'query') {
      queries.push([file.name, file.schema(postgraphql)])
    } else if (file.type === 'mutation') {
      mutations.push([file.name, file.schema(postgraphql)])
    } else {
      throw new Error(`Invalid type '${file.type}' in injection named ${file.name}.`)
    }
  })

  initialized = true
}

export default function loadInjections(dirToInject: string, type: string): Array<[string, GraphQLFieldConfig<never, mixed>]> {

  if (dirToInject === '' ) {
    return []
  }

  if (!initialized) {
    initInjections(dirToInject)
  }

  return type === 'query' ? queries : mutations

}
