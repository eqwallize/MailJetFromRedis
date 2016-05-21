//initialize redis
var redisLib = require('redis');
var Mailjet = require('mailjet-sendemail');
var push = require('./push/push');
var mailLib;
var redisSub;

var KEY_SUBSCRIBE_REDIS_MAIL_SEND = 'mail.send';
var KEY_SUBSCRIBE_REDIS_PUSH_SEND = 'push.send';

var config = require('./config.json');
var API_KEY = config.mailjet.api_key;
var API_SECRET = config.mailjet.api_secret;

var MAX_MAIL_ONCE = 49;

//Redis info
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var pwd = process.env.REDIS_PWD;


var mailParser = function(recipient_list){
        var return_vals = {
            'to': [],
            'cc': [],
            'bcc': []
        }
    for (var i = 0; i < recipient_list.length; ++i) {
        var parsed = recipient_list[i].split(':');
        (parsed.length > 1) ? return_vals[parsed[0]].push(parsed[1])
            : return_vals['to'].push(parsed[0]);
    }
    return return_vals;

}

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

/**
 * Send mail to hided content.
 * They will just receive a copy.
 * @param bcc
 */
var sendToBcc = function(bcc){
    var nbIt = Math.floor(bcc.length/MAX_MAIL_ONCE);
    var nbRest = bcc.length%MAX_MAIL_ONCE;

    for(var i =0; i < nbIt*MAX_MAIL_ONCE; i = i+MAX_MAIL_ONCE){
        var tab = msg.destinations.slice(i, i + MAX_MAIL_ONCE);
        //we NEED to have at least one to, so use default one.
        tab.push("to:"+config.defaultMail);
        mailLib.sendContent(msg.from, tab,
            msg.subject, msg.type, msg.content);
    }
    //manage rest
    if(nbRest != 0){
        var tab = msg.destinations.slice(msg.destinations.length-nbRest, msg.destinations.length);
        tab.push("to:"+config.defaultMail);
        mailLib.sendContent(msg.from, tab,
            msg.subject, msg.type, msg.content);
    }
};

/** 
 * In charge of asking mailJet to send emails. 
 * If too much recipients, send multiple mails
 */
var sendMail = function(redisMessage){
    msg = JSON.parse(redisMessage);

    var destinations = mailParser(msg.destinations);

    if(destinations["bcc"].length > 0){
        //bcc are different because need to hide them
        sendToBcc(destinations["bcc"]);
    }

    //DO next time: add a way to manage limitation for cc and to
    mailLib.sendContent(msg.from, destinations["to"].concat(destinations["cc"]), msg.subject, msg.type, msg.content);

}

/** manage redis pub/sub. */
var manageRedisSub = function(){
    redisSub.on("message", function(channel, message) { 
        console.log('subscribe ' + " channel: "+ channel + " msg: "+ message);    
        try {
		  if(channel == KEY_SUBSCRIBE_REDIS_MAIL_SEND){
           		sendMail(message);
       	    } else if(channel == KEY_SUBSCRIBE_REDIS_PUSH_SEND){
           		push.sendPush(message);
       		}     
        }catch(e){
            console.log("error sending "+channel+  "  " + message + "error: " +e );
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
