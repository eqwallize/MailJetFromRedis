var apn = require('./apn')
var gcm = require('./gcm')

module.exports = {
 
    sendPush : function(redisMessage){
        var msg = JSON.parse(redisMessage);

        var dest = separateDestinations(msg);
        //send messages over apns
        apn.sendPush(msg.title, msg.body, dest.apn);
        //send messages over GCM
        gcm.sendPush(msg.title, msg.body , dest.gcm);
    }
};

/**
 * Separate GCM and APN in both array.
 * @param redisMessage
 * @returns {{apn: Array, gcm: Array}}
 */
var separateDestinations = function(redisMessage){
    var dest = {
        apn:[],
        gcm:[]
    };

    var device;
    for(var i=0; i<redisMessage.devices.length; i++){
        device = redisMessage.devices[i];
        if(device.pushType == 'APN'){
            dest.apn.push(device.pushToken);
        } else if(device.pushType == 'GCM'){
            dest.gcm.push(device.pushToken);
        } else {
            try{
                console.log("unknown device : "+ JSON.stringify(device));
            } catch (e){
                console.log("Error : " + e)
            }
        }
    }

    return dest;
}