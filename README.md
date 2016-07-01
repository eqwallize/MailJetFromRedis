MailJetFromRedis
=========
## Description
Subscribe to redis to get order to send emails
* mail.send : to send a new email

To call it from redis-cli: 
* PUBLISH mail.send '{"from":"dummy@mail.com", "content":"mail content de test", "type":"text", "destinations":["stephane.castrec@gmail.com","cc:stephane@eqwall.com", "bcc:stephane.castrec@facebook.com"], "subject":"mail subject"}'
* PUBLISH push.send '{"title":"Titre du message", "body":"Texte du message à envoyer", "devices"[{"pushToken":"UUID1", "type":"APN"}, {"pushToken":"UUID2", "type":"GCM"} ]}'
## Dependencies
* npm install
** redis
** mailjet
** node-apn
** node-gcm

## run
* node main.js

## Config
'
{
    "mailjet":{
        "api_key":"",
        "api_secret":""
    },
    "gcm":{
        "api_key":""
    },
    "apn":{
        "cert":"",
        "key":""
    },
    "defaultMail":""
}
'


## Authors

## Warning
Commited a custom version of mailjet. 
This custom version manage correctly multiple recipients. 
To remove when pull request will be done and accepted.
Sorry about that.

**Stéphane Castrec**
+ @\_stephane_
