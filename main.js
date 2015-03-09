//initialize redis
var redisLib = require('redis');
var Mailjet = require('mailjet-sendemail');
var mailLib;
var redisSub;
var KEY_SUBSCRIBE_REDIS_MAIL_SEND = 'mail.send';
var config = require('./config.json');
var API_KEY = config.mailjet.api_key;
var API_SECRET = config.mailjet.api_secret;

var connectRedis = function(){
   try{
    	var port = process.env.REDIS_PORT_6379_TCP_PORT;
    	var host = process.env.REDIS_PORT_6379_TCP_ADDR;    
    	redisSub = redisLib.createClient(port, host);
    	redis = redisLib.createClient(port, host);
   } catch(e){
    	console.log("error connecting to redis" + e);
   	redisSub = redisLib.createClient();
    	redis = redisLib.createClient();
   }
    manageRedisSub();
};


var manageRedisSub = function(){
    redisSub.subscribe(KEY_SUBSCRIBE_REDIS_MAIL_SEND);
    redisSub.on("message", function(channel, message) { 
        console.log('subscribe ' + " channel: "+ channel + " msg: "+ message);    
	   if(channel == KEY_SUBSCRIBE_REDIS_MAIL_SEND){
           msg = JSON.parse(message);
           
            mailLib.sendContent(msg.from, msg.destinations,
                msg.subject, msg.type, msg.content);
       }
    });

    redisSub.on("error", function(message){
        //Deal with error
        //TODO add a count to avoid infinite loop
        connectRedis();    
        console.log('error redis redis disconnected ' + message);    
    });
};

mailLib = new Mailjet (API_KEY, API_SECRET);
	    
connectRedis();
