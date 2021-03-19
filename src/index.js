const docClient = require('./doc-client');
const partiClient = require('./parti-client');

module.exports = { docClient: docClient.default, partiClient: partiClient.default };
