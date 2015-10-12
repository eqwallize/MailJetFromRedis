MailJetFromRedis
=========
## Description
Subscribe to redis to get order to send emails
* mail.send : to send a new email

To call it from redis-cli: 
* PUBLISH mail.send '{"from":"dummy@mail.com", "content":"mail content de test", "type":"text", "destinations":["stephane.castrec@gmail.com","cc:stephane@eqwall.com", "bcc:stephane.castrec@facebook.com"], "subject":"mail subject"}'
* d
## Dependencies
* npm install redis
* npm install mailjet-sendemail

## run
* node main.js

## Authors

## Warning
Commited a custom version of mailjet. 
This custom version manage correctly multiple recipients. 
To remove when pull request will be done and accepted.
Sorry about that.

**Stéphane Castrec**
+ @\_stephane_
