const ping = require('ping');
const Server = require('../model/server/schema');

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
              .probe(host.address, {
                timeout: 1
              })
              .then((res) => {
                console.log(`${host.address} : ${res.time}`);

                if (res.time === 'unknown') {
                  addTimeStamp(host, { active: false, responseTime: null });
                  email.warning(host, emailAddresses);
                } else {
                  addTimeStamp(host, { active: true, responseTime: res.time });
                }
              });
          });
        }, 60000);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getServers() {
  return new Promise((resolve, reject) => {
    let servers;
    Server.find({})
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
/** Takes a server object as first parameter and an object with
 * a active: boolean, responsetime: number
 */
function addTimeStamp(server, timestamp) {
  timestamp.date = new Date();
  server.timestamps.push(timestamp);
  server.save((err) => {
    if (err) return handleError(err);
  });
}

function filterServerData(servers) {
  const filteredServers = [];
  for (let i = 0; i < servers.length; i += 1) {
    const server = {
      name: servers[i].name,
      address: servers[i].address,
      avg: calcAvg(servers[i].timestamps)
    };
    filteredServers.push(server);
  }
  return filteredServers;
}

function calcAvg(timestamps) {
  const timestampPerHour = [];
  for (let i = 0; i < 13; i += 1) {
    timestampPerHour.push(calc(timestamps, i));
  }
  return timestampPerHour.reverse();
}

function calc(timestamps, hour) {
  const date = new Date();
  const date2 = new Date();
  date.setHours(date.getHours() - hour);
  date2.setHours(date2.getHours() - hour - 1);
  let total = 0;
  let count = 0;

  for (let i = 0; i < timestamps.length; i += 1) {
    if (
      timestamps[i].date < date.getTime() &&
      timestamps[i].date >  date2.getTime()
    ) {
      if (timestamps[i].active === false) {
        return 1;
      }

      count += 1;
      total += timestamps[i].responseTime;
    }
  }
  return total / count;
}

module.exports = {
  monitorStart,
  monitorStop,
  getServers,
  filterServerData
};
