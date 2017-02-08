const fs = require.requireActual('fs')

// Mock the writeFile for the export tests
const writeFile = jest.fn((path, contents, callback) => {
  callback()
})

module.exports = {
  ...fs
  writeFile,
}
