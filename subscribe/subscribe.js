var config = require('../config.json');

var API_KEY = config.mailjet.api_key;
var API_SECRET = config.mailjet.api_secret;

const mailjet = require('node-mailjet').connect(API_KEY, API_SECRET);

module.exports = {    
    /** 
     * In charge of asking mailJet to subscribe user in contact list to receive welcome email campaign. 
     */
    subscribeUser : function(redisMessage){
        msg = JSON.parse(redisMessage);
        
        var name = msg.firstname + " " + msg.lastname;
        var firstname = msg.firstname;
        var lastname = msg.lastname;
        var email = msg.email;
        var number = "";
        if(msg.phoneNumber) {
            number = msg.phoneNumber;
        }
        var society = "";
        if(msg.society) {
            society = msg.society;
        }
        var language = "";
        if(msg.language) {
            language = msg.language;
        }
        
        
        subrscribeUser(name, email, number, society, lastname, firstname, language);
    }
};

var subrscribeUser = function(name, email, number, society, lastname, firstname, language) {
    const request = mailjet
        .post("contactslist")
        .id(2305683)
        .action("ManageManyContacts")
        .request({
            "Action":"addnoforce",
            "Contacts":[
                {
                    "Email": email,
                    "Name": name,
                    "Properties": {
                        "Dev_tel": number,
                        "Dev_societe": society,
                        "Dev_nom": lastname,
                        "Dev_prenom": firstname,
                        "Dev_langue": language
                    }
                }
            ]
        })
    
    request
    .then((result) => {
        console.log("Success to subscribe welcome campaign:", name + ' ' + email + ' ' + number + ' ' + society + ' ' + lastname + ' ' + firstname + ' ' + language);
    })
    .catch((err) => {
        console.log("Fail to subscribe welcome campaign:", err.statusCode)
    })
}