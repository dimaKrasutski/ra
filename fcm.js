var admin = require("firebase-admin");

var serviceAccount = require("./road-assistance-1-firebase-adminsdk-j28g9-985a9898cb");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://road-assistance-1.firebaseio.com"
});

var gcm = require('node-gcm');


var message = new gcm.Message({
    collapseKey: 'demo',
    priority: 'high',
    contentAvailable: true,
    delayWhileIdle: true,
    timeToLive: 3,
    restrictedPackageName: "somePackageName",
    dryRun: true,
    data: {
        key1: 'message1',
        key2: 'message2'
    },
    notification: {
        title: "Hello, Igor",
        icon: "ic_launcher",
        body: 'It is our first fcm notification Yoffi!!!!!!!!'
    }
});

// Set up the sender with you API key
var sender = new gcm.Sender('AAAAHMAUjrA:APA91bFYw2_60jFAhub-S8796F-7cxo4lBH9iUrNRQOhWg5QcaZXWkT7rwCD0VgPXXcsX-Ane2vGe3homrzjCwKlyW-4GI6hEG0pLZSmVrTGuxyHzWVzVJqWEH-xzzxLzmKu9khcK7HB');

// Add the registration tokens of the devices you want to send to
var registrationTokens = [];
registrationTokens.push('regToken1');


sender.sendNoRetry(message, { registrationTokens: registrationTokens }, function(err, response) {
    if(err) console.error(err);
    else    console.log(response);
});

// ... or retrying
sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
    if(err) console.error(err);
    else    console.log(response);
});

// ... or retrying a specific number of times (10)
sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
    if(err) console.error(err);
    else    console.log(response);
});



 // let FCM = require('fcm-push');
 // let serverkey = 'AAAAHMAUjrA:APA91bFYw2_60jFAhub-S8796F-7cxo4lBH9iUrNRQOhWg5QcaZXWkT7rwCD0VgPXXcsX-Ane2vGe3homrzjCwKlyW-4GI6hEG0pLZSmVrTGuxyHzWVzVJqWEH-xzzxLzmKu9khcK7HB';
 // let fcm = new FCM(serverkey);
 // let message = {
 //     to : '<insert-device-token>',
 //         collapse_key : '<insert-collapse-key>',
 //         data : {
 //     <random-data-key1> : '<random-data-value1>',
 //     <random-data-key2> : '<random-data-value2>'
 //     },
 //     notification : {
 //            title : 'Road Assistance',
 //             body : 'Hello everyone'
 //     }
 // };
 // fcm.send(message, function(err,response){
 //     if(err) {
 //         console.log("Something has gone wrong !");
 //     } else {
 //         console.log("Successfully sent with resposne :",response);
 //     }
 // });