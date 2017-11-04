const ping = require('ping');
const Server = require('../model/server/schema');
const Timestamp = require('../model/timestamp/schema');

const contact = require('../model/contact/schema');
const email = require('../lib/email');
const _ = require('lodash');

let interval;

function monitorStart() {
  let hosts;
  let emailAddresses;

  Promise.all([getServers(), getEmailAdresses()])
    .then((values) => {
      hosts = values[0];
      emailAddresses = values[1];
    })
    .then(() => {
      if (hosts.length > 0 && emailAddresses.length > 0) {
        email.start(emailAddresses);
        interval = setInterval(() => {
          hosts.forEach((host) => {
            ping.promise
              .probe(host, {
                timeout: 1
              })
              .then((res) => {
                console.log(`${host} : ${res.time}`);
                if (res.time === 'unknown') {
                  email.warning(host, emailAddresses);
                }
              });
          });
        }, 5000);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getServers() {
  return new Promise((resolve, reject) => {
    let servers;
    Server
      .find({})
      .exec()
      .then(
        (docs) => {
          servers = _.map(docs, 'address');
          resolve(servers);
        },
        (error) => {
          reject(error);
        }
      );
  });
}

function getServ() {
  return new Promise((resolve, reject) => {
    let servers;
    Server
      .find({})
      .exec()
      .then(
        (docs) => {
          // servers = _.map(docs, 'address');
          resolve(docs);
        },
        (error) => {
          reject(error);
        }
      );
  });
}

function getServ2() {
  return new Promise((resolve, reject) => {
    let servers;
    Server
      .findOne({ name: 'Google' })
      .populate('timestamps')
      .exec()
      .then(
        (docs) => {
          // servers = _.map(docs, 'address');
          resolve(docs);
        },
        (error) => {
          reject(error);
        }
      );
  });
}

function getEmailAdresses() {
  return new Promise((resolve, reject) => {
    let emails;
    contact
      .find({})
      .exec()
      .then(
        (docs) => {
          emails = _.map(docs, doc => _.pick(doc, ['name', 'email']));
          resolve(emails);
        },
        (error) => {
          reject(error);
        }
      );
  });
}

function monitorStop() {
  clearInterval(interval);
}

function addTimeStamp(server) {
  const TS = new Timestamp({
    date: 1232,
    active: true,
    responseTime: 29,
    server: server._id
  });
  TS.save((err) => {
    if (err) return handleError(err);

  });

  // server.timestamps.push(TS);
  // server.save();
}


module.exports = {
  monitorStart,
  monitorStop,
  getServers,
  getServ,
  getServ2,
  addTimeStamp
};
