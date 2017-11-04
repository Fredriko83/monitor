const Controller = require('../../lib/controller');
const timestampFacade = require('./facade');

class TimestampController extends Controller {}

module.exports = new TimestampController(timestampFacade);
