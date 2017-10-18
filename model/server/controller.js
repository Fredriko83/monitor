const Controller = require('../../lib/controller');
const serverFacade = require('./facade');

class ServerController extends Controller {}

module.exports = new ServerController(serverFacade);
