const express    = require('express');
const path = require('path');
let favicon = require('serve-favicon');
const mongoose   = require('mongoose');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
const morgan     = require('morgan');
const bluebird   = require('bluebird');
const hbs = require('hbs');

const dotenv = require('dotenv').config();

const config = require('./config');

const routes = require('./routes');
const index = require('./routes/index');

const app  = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

mongoose.Promise = bluebird;
mongoose.connect(config.mongo.url);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// View
app.use('/', index);
// API
app.use('/', routes);

app.listen(config.server.port, () => {
  console.log(`Port: ${config.server.port}`);
});

module.exports = app;
