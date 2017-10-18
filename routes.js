const Router = require('express').Router;
const router = new Router();

const server = require('./model/server/router');
const contact = require('./model/contact/router');
const alert = require('./model/alert/router');

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to monitor API!' });
});

router.use('/server', server);
router.use('/contact', contact);
router.use('/alert', alert);

module.exports = router;
