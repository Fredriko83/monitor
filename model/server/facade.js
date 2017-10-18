const Facade = require('../../lib/facade');
const serverSchema = require('./schema');

class ServerFacade extends Facade {}

module.exports = new ServerFacade(serverSchema);
