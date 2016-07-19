/**
 * doc here
 * https://github.com/ToothlessGear/node-gcm
 */
var gcm = require('node-gcm');
var config = require('../config.json');
var sender = new gcm.Sender(config.gcm.api_key);


module.exports = {
 
  sendPush : function(title, body, registrationTokens){
        // create message
        var message = new gcm.Message({
            collapseKey: 'eqwall',
            delayWhileIdle: true,
            timeToLive: 3,
            restrictedPackageName: "com.eqwall.android",
            notification: {
                title: title,
                body: body,
                icon: "ic_launcher"
            }
        });

        //send with 10 retries
        sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
          if(err) console.error(err);
          else    console.log(response);
        });

    }

};