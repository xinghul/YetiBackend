(function () {
    "use strict";
    var Q        = require("q"),
        mongoose = require("mongoose");

    var User     = mongoose.model("User"),
        Counter  = mongoose.model("Counter");

    module.exports = {
        signUp : function (data) {
            var deferred = Q.defer();
            process.nextTick(function () {
                if ([undefined, null, ''].indexOf(data) !== -1 ||
                    [undefined, null, ''].indexOf(data.username) !== -1 ||
                    [undefined, null, ''].indexOf(data.password) !== -1)
                    deferred.reject("Missing credentials!");
                else {
                    // find a user whose username is the same as the forms username
                    // we are checking to see if the user trying to login already exists
                    User.findOne({ 'username' :  data.username }, function (err, user) {
                        // if there are any errors, return the error
                        if (err) {
                            deferred.reject(err);
                        }
                        else {
                            // check to see if theres already a user with that username
                            if (user) {
                                deferred.reject("That username is already taken.");
                            } 
                            else {

                                // if there is no user with that username
                                // create the user
                                var newUser      = new User();

                                // set the user's local credentials
                                newUser.username = data.username;
                                newUser.password = newUser.generateHash(data.password);

                                // get the uid for the user
                                Counter.getNextSequence("user").then(function (uid) {
                                    newUser.uid  = uid;
                                    // save the user
                                    newUser.save(function (err) {
                                        if (err)
                                            deferred.reject(err);
                                        else 
                                            deferred.resolve(newUser);
                                    });
                                });   
                            }
                        }
                    });     
                }
            });    
            return deferred.promise;
        },
        logIn : function (data) {
            var deferred = Q.defer();
            process.nextTick(function () {
                if ([undefined, null, ''].indexOf(data) !== -1 ||
                    [undefined, null, ''].indexOf(data.username) !== -1 ||
                    [undefined, null, ''].indexOf(data.password) !== -1)
                    deferred.reject("Missing credentials!");
                else {
                    // find a user whose username is the same as the forms username
                    // we are checking to see if the user trying to login already exists
                    User.findOne({ 'username' :  data.username }, function (err, user) {
                        // if there are any errors, return the error before anything else
                        if (err)
                            deferred.reject(err);
                        else {
                            // if no user is found, return the message
                            if (!user)
                                deferred.reject("No user found."); // req.flash is the way to set flashdata using connect-flash

                            // if the user is found but the password is wrong
                            else if (!user.validPassword(data.password))
                                deferred.reject("Oops! Wrong password."); // create the loginMessage and save it to session as flashdata

                            // all is well, return successful user
                            else
                                deferred.resolve(user);
                        }
                    });
                }
            });
            return deferred.promise;
        }
    };
}());