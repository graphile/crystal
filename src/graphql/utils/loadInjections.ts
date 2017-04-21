/**
 * A utility function for requiring all files in a provided directory
 * Returns an array of double dimensions, as expected by mutationEntries
 */

import {  GraphQLFieldConfig } from 'graphql'
import * as requireGlob  from 'require-glob'

export default function loadInjections(dirToInject: string, type: string): Array<[string, GraphQLFieldConfig<never, mixed>]> {

  if (dirToInject === '' ) return []

  const injections = requireGlob.sync(dirToInject, {
    cwd: process.cwd(),
		reducer: function (options, tree, file) {
        if (!Array.isArray(tree)) tree = []
        if (file.exports.type === type) tree.push([file.exports.name, file.exports.schema])
        return tree
      },
    })

  return injections
}
