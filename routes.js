const Router = require('express').Router;
const router = new Router();

const server = require('./model/server/router');
const contact = require('./model/contact/router');
const alert = require('./model/alert/router');
const timestamp = require('./model/timestamp/router');

router.use('/server', server);
router.use('/contact', contact);
router.use('/alert', alert);
router.use('/timestamp', timestamp);

module.exports = router;
