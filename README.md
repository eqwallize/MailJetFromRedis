MailJetFromRedis
=========
## Description
Subscribe to redis to get order to send emails
* mail.send : to send a new email

To call it from redis-cli: 
* PUBLISH mail.send '{"from":"dummy@mail.com", "content":"mail content de test", "type":"text", "destinations":["stephane.castrec@gémail.com"], "subject":"mail subject"}'

## Dependencies
* npm install redis
* npm install mailjet-sendemail

## run
* node main.js

## Authors

**Stéphane Castrec**
+ http//twitter.com/_stephane_
