const tsc = require('typescript')
const tsConfig = require('../tsconfig.json')

module.exports = {
  process (src, fileName) {
    // Make sure that source maps are always enabled and inline so that they
    // can be picked up by the `source-map-support` package.
    const compilerOptions = Object.assign({}, tsConfig.compilerOptions, { sourceMap: true, inlineSourceMap: true })
    return tsc.transpileModule(src, { compilerOptions, fileName }).outputText
  }
}
