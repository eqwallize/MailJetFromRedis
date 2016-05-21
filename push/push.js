var apn = require('./apn')
var gcm = require('./gcm')

module.exports = {
 
    sendPush : function(redisMessage){
        //send messages over apns
        apn.sendPush(redisMessage.title, redisMessage.body, redisMessage.apn);
        //send messages over GCM
        gcm.sendPush(redisMessage.title, redisMessage.body , redisMessage.gcm);
    }
};