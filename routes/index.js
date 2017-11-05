const express = require('express');
const router = express.Router();
const monitor = require('../lib/monitor');

/* GET home page. */
router.get('/', (req, res, next) => {
  let servers;
  monitor.getServers().then((values) => {
    servers = values;
    servers = monitor.filterServerData(servers);
    console.log(JSON.stringify(servers, null, 2));
    res.render('index', { title: 'Monitor', servers });
  });
});

module.exports = router;
