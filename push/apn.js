/**
 * doc here
 * https://github.com/ToothlessGear/node-apn
 */
var apn = require('apn');
var config = require('../config.json');

var options = { };
var apnConnection = new apn.Connection(options);

module.export = {
    sendPush : function(title, body, devices){
        //create notification
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.alert = {
            title: title,
            body: body
        };
        note.payload = {'messageFrom': 'Caroline'};

        //then send, to all devices
        for(device in devices){
            apnConnection.pushNotification(note, myDevice);
        }
    }
};