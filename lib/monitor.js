const ping = require('ping');
const server = require('../model/server/schema');
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
    server
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

module.exports = {
  monitorStart,
  monitorStop
};
