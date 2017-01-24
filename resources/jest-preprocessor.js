/* tslint:disable */

const tsc = require('typescript')
const tsConfig = require('../tsconfig.json')

const compilerOptions = tsConfig.compilerOptions

module.exports = {
  process (src, fileName) {
    // Make sure that source maps are always enabled and inline so that they
    // can be picked up by the `source-map-support` package.
    return tsc.transpileModule(src, {
      compilerOptions: compilerOptions,
      fileName: fileName,
    }).outputText
  }
}
