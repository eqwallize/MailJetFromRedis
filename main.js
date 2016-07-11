//initialize redis
var redisLib = require('redis');
var push = require('./push/push');
var mail = require('./mail/mail');
var redisSub;

var KEY_SUBSCRIBE_REDIS_MAIL_SEND = 'mail.send';
var KEY_SUBSCRIBE_REDIS_PUSH_SEND = 'push.send';

var config = require('./config.json');


//Redis info
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var pwd = process.env.REDIS_PWD;



var connectRedisSub = function(){
    console.log("connect");
    try {
        //if env var exist, user it
        if(port && host){
            console.log("connect to host  : "+host+":"+port);
            var options = {
            };
            if(pwd){
                console.log("redis with pwd  ");
                options.auth_pass = pwd;
            } else {
                console.log("redis no pwd  ");
            }

            redisSub = redisLib.createClient(port, host, options);
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
           		mail.sendMail(message);
       	    } else if(channel == KEY_SUBSCRIBE_REDIS_PUSH_SEND){
           		push.sendPush(message);
       		}     
        }catch(e){
            console.log("error sending "+channel+  "  " + message + "error: " +e );
        }  
    });
    redisSub.on("connect", function(message){
        redisSub.subscribe(KEY_SUBSCRIBE_REDIS_MAIL_SEND);
        redisSub.subscribe(KEY_SUBSCRIBE_REDIS_PUSH_SEND);
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

connectRedisSub();
