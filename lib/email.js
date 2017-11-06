const email = require('emailjs');

const server = email.server.connect({
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  host: process.env.MAIL_SMTP,
  ssl: true
});

let timestamp;

function start(emailAddresses) {
  server.send(
    {
      text: 'Monitoring Started',
      from: `Monitor <${server.user}>`,
      to: stringEmails(emailAddresses),
      subject: 'Monitoring of the following servers has started:'
    },
    (err, message) => {
      console.log(err || message);
    }
  );
}

function warning(host, emailAddresses) {
  if (timestamp === undefined || (new Date().getTime() - 60000 * 15) > timestamp) {
    server.send(
      {
        text: `Server ${host.name} is down!`,
        from: `Monitor <${server.user}>`,
        to: stringEmails(emailAddresses),
        subject: `Server ${host.name} is down!`
      },
      (err, message) => {
        console.log(err || message);
        timestamp = new Date().getTime();
      }
    );
  } 
}

function retraction() {
  server.send(
    {
      text:
        "False alarm but maybe talk a look... and don't shoot the messenger!",
      from: `you <${server.user}>`,
      to: 'Fredrik <fredriko.olsson@gmail.com>',
      subject: 'Sorry...'
    },
    (err, message) => {
      console.log(err || message);
    }
  );
}

function stringEmails(emails) {
  let emailString = '';
  for (let i = 0; i < emails.length; i += 1) {
    emailString += `${emails[i].name} <${emails[i].email}>, `;
  }
  return emailString.substring(0, (emailString.length - 2));
}

module.exports = {
  start,
  warning
};
