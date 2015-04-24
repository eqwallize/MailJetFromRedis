//initialize redis
var redisLib = require('redis');
var Mailjet = require('mailjet-sendemail');
var mailLib;
var redisSub;
var KEY_SUBSCRIBE_REDIS_MAIL_SEND = 'mail.send';
var config = require('./config.json');
var API_KEY = config.mailjet.api_key;
var API_SECRET = config.mailjet.api_secret;

//Redis info
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var connectRedisSub = function(){
    console.log("connect");
    try {
        //if env var exist, user it
        if(port && host){
            redisSub = redisLib.createClient(port, host);
        } else {
            //else give a try to default
            redisSub = redisLib.createClient();
        }
    }catch(e){
        console.log("couldn't connect to redis Sub", e);
    }
    if(redisSub){ 
        manageRedisSub();
    }
};

/** manage redis pub/sub. */
var manageRedisSub = function(){
    redisSub.on("message", function(channel, message) { 
        console.log('subscribe ' + " channel: "+ channel + " msg: "+ message);    
        try {
		if(channel == KEY_SUBSCRIBE_REDIS_MAIL_SEND){
           		msg = JSON.parse(message);
            		mailLib.sendContent(msg.from, msg.destinations,
                		msg.subject, msg.type, msg.content);
       		}     
	}catch(e){
		console.log("error sending email " + message + "error: " +e );
	}  
    });
    redisSub.on("connect", function(message){
        redisSub.subscribe(KEY_SUBSCRIBE_REDIS_MAIL_SEND);
    });    
    redisSub.on("error", function(message){
        //Deal with error
        console.log('error redis' + message);    
    });
    
    redisSub.on("end", function(message){
        //Deal with error
        console.log('error redis end ' + message);    
    });
};

mailLib = new Mailjet (API_KEY, API_SECRET);

connectRedisSub();
