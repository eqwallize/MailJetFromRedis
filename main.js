//initialize redis
var redisLib = require('redis');
var Mailjet = require('mailjet-sendemail');
var mailLib;
var redisSub;
var KEY_SUBSCRIBE_REDIS_MAIL_SEND = 'mail.send';
var config = require('./config.json');
var API_KEY = config.mailjet.api_key;
var API_SECRET = config.mailjet.api_secret;

var MAX_MAIL_ONCE = 49;

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

/** 
 * In charge of asking mailJet to send emails. 
 * If too much recipients, send multiple mails
 */
var sendMail = function(redisMessage){
    msg = JSON.parse(redisMessage);
        var nbIt = msg.destinations.length/MAX_MAIL_ONCE;
        var nbRest = msg.destinations.length%MAX_MAIL_ONCE;
        console.log("nbIt:"+nbIt);
        console.log("nbRest:"+nbRest);
        for(var i =0; i < nbIt*MAX_MAIL_ONCE; i = i+MAX_MAIL_ONCE){
            console.log("i:"+i);
            var tab = msg.destinations.slice(i, i + MAX_MAIL_ONCE); 
            tab.push("to:contact@eqwall.com");
            console.log(tab);

            mailLib.sendContent(msg.from, tab,
                msg.subject, msg.type, msg.content);
        }
        //manage rest
        if(nbRest != 0){
           var tab = msg.destinations.slice(msg.destinations.length-nbRest, msg.destinations.length); 
            console.log(tab);
            tab.push("to:contact@eqwall.com");
            mailLib.sendContent(msg.from, tab,
                msg.subject, msg.type, msg.content); 
        }
    
}

/** manage redis pub/sub. */
var manageRedisSub = function(){
    redisSub.on("message", function(channel, message) { 
        console.log('subscribe ' + " channel: "+ channel + " msg: "+ message);    
        try {
		  if(channel == KEY_SUBSCRIBE_REDIS_MAIL_SEND){
           		sendMail(message);
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
