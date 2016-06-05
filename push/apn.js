/**
 * doc here
 * https://github.com/argon/node-apn
 */
var apn = require('apn');
var config = require('../config.json');

var options = {
    cert: config.apn.cert,
    key: config.apn.key
};
var apnConnection = new apn.Connection(options);

module.export = {
    sendPush : function(title, body, registrationTokens){
        //create notification
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.alert = {
            title: title,
            body: body
        };

        //then send, to all devices
        for(var i=0; i<registrationTokens.length; i++){
            apnConnection.pushNotification(note, registrationTokens[i]);
        }
    }
};