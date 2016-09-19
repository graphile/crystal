var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../schema.json');

module.exports = getbabelRelayPlugin(schema.data);
