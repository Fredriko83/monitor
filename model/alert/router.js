const Router = require('express').Router;
const router = new Router();
const monitor = require('../../lib/monitor');

router.get('/start', (req, res) => {
  monitor.monitorStart();
  res.status(200);
  // .then(collection => res.status(200).json(collection))
  // .catch(err => next(err));
});

router.get('/stop', (req, res) => {
  monitor.monitorStop();
  res.status(200);
  // .then(collection => res.status(200).json(collection))
  // .catch(err => next(err));
});

module.exports = router;
