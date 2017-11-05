const Router = require('express').Router;
const router = new Router();
const monitor = require('../../lib/monitor');

router.get('/start', (req, res) => {
  monitor.monitorStart();
  res.json({ alert: 'Started' });
});

router.get('/stop', (req, res) => {
  monitor.monitorStop();
  res.json({ alert: 'Stopped' });
});

module.exports = router;
