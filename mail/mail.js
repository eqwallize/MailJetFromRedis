var config = require('../config.json');

var Mailjet = require('mailjet-sendemail');
var mailLib;

var API_KEY = config.mailjet.api_key;
var API_SECRET = config.mailjet.api_secret;

var MAX_MAIL_ONCE = 49;

mailLib = new Mailjet (API_KEY, API_SECRET);

module.exports = {    
    /** 
     * In charge of asking mailJet to send emails. 
     * If too much recipients, send multiple mails
     */
    sendMail : function(redisMessage){
        msg = JSON.parse(redisMessage);

        var destinations = mailParser(msg.destinations);

        if(destinations["bcc"].length > 0){
            //bcc are different because need to hide them
            sendToBcc(destinations["bcc"]);
        }

        //DO next time: add a way to manage limitation for cc and to
        mailLib.sendContent(msg.from, destinations["to"].concat(destinations["cc"]), msg.subject, msg.type, msg.content);

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
};

