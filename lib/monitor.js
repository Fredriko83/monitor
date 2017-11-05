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
                  addTimeStamp(host, {active: false, responseTime: null})
                  email.warning(host, emailAddresses);
                } else {
                  addTimeStamp(host, {active: true, responseTime: res.time})
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
    Server
      .find({})
      .exec()
      .then(
        (docs) => {
          //servers = _.map(docs, 'address');
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

function filterServerData(servers){
  var servers2 = []
  for (var index = 0; index < servers.length; index++) {
    var server = {
      name: servers[index].name,
      address: servers[index].address,
      //avg: [23, 43, 12, 43, 12, 32, 12, 23, 41, 19, 25, 15, 35]
      avg: calcAvg(servers[index].timestamps)
    }
    servers2.push(server);
    
    }
    return servers2;
}

function calcAvg(timestamps){
  var bla = [];
  for (var i = 0; i < 13; i++) {
    bla.push(calc(timestamps, i))
  }
  return bla.reverse();
}

function calc(timestamps, hour){
  var date = new Date();
  var date2 = new Date();
  var total = 0;
  var count = 0;

  for (var i = 0; i < timestamps.length; i++) {
    if(timestamps[i].date < date.setHours(date.getHours() - hour) && timestamps[i].date > date2.setHours(date2.getHours() - hour - 1)) {
      if(timestamps[i].responseTime === "unknown"){
        return 0;
      }
      count++;
      total += timestamps[i].responseTime;
    }
  }
  return total/count;
}

module.exports = {
  monitorStart,
  monitorStop,
  getServers,
  filterServerData
};