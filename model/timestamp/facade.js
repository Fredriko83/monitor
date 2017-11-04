const Facade = require('../../lib/facade');
const timestampSchema = require('./schema');

class TimestampFacade extends Facade {}

module.exports = new TimestampFacade(timestampSchema);
