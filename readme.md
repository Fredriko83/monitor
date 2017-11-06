# monitor
Simple tool for monitoring servers via ping and emailing when somethings down. Not intended for any real monitoring,
just a quick monitoring tool for a course in server configuration where monitoring isn't the focus, getting it up and runnging with
ansible is.

# Create .env file in the root of the project containing:

MAIL_USER=email@gmail.com  
MAIL_SMTP=smtp.gmail.com  
MAIL_PASSWORD=supersecretpassword  
DB_URI=mongodb://mongo:supersecretpassword@ds117935.mlab.com:17935/monitor  
(DB_URI not needed if started with docker-compose)

post servers to be monitored to /servers  
{  
"name":"Node..."  
"ip":"192..."  
}

and contact to /contact  
{  
"name":"Node..."  
"email":"email@email.com..."  
}


get /alert starts monitoring  
get /stop stops it 

There should also be an overview at / but this isn't implemented ATM...
