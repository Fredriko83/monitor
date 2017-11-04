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

router.get('/test', (req, res) => {
  monitor.getServ().then((bla) => {
    console.log(bla);
    monitor.addTimeStamp(bla[0]);
  });
});

router.get('/test2', (req, res) => {
  monitor.getServ2().then((bla) => {
    console.log(bla);
  });
});

module.exports = router;
