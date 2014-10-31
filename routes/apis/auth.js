(function () {
    "use strict";
    var Q        = require("q"),
        mongoose = require("mongoose");
    // var User     = require("../models/user");
    var User     = mongoose.model("User");

    exports.signUp = function (data) {
        var deferred = Q.defer();
        console.log(data);
        process.nextTick(function () {
            if ([undefined, null, ''].indexOf(data) !== -1 ||
                [undefined, null, ''].indexOf(data.email) !== -1 ||
                [undefined, null, ''].indexOf(data.password) !== -1)
                deferred.reject("Missing credentials!");
            else {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'local.email' :  data.email }, function (err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        deferred.reject(err);
                    }
                    else {
                        // check to see if theres already a user with that email
                        if (user) {
                            deferred.reject("That email is already taken.");
                        } 
                        else {

                            // if there is no user with that email
                            // create the user
                            var newUser            = new User();

                            // set the user's local credentials
                            newUser.local.email    = data.email;
                            newUser.local.password = newUser.generateHash(data.password);

                            // save the user
                            newUser.save(function (err) {
                                if (err)
                                    deferred.reject(err);
                                else 
                                    deferred.resolve(newUser);
                            });
                        }

                    }
                });     
            }
        });    
        return deferred.promise;
    };

    exports.logIn = function (data) {
        var deferred = Q.defer();
        console.log(data);
        process.nextTick(function () {
            if ([undefined, null, ''].indexOf(data) !== -1 ||
                [undefined, null, ''].indexOf(data.email) !== -1 ||
                [undefined, null, ''].indexOf(data.password) !== -1)
                deferred.reject("Missing credentials!");
            else {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'local.email' :  data.email }, function (err, user) {
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
    };

    exports.quickLogIn = function (data) {
        var deferred = Q.defer();
        if ([undefined, null].indexOf(data)     !== -1 ||
            [undefined, null].indexOf(data.mac) !== -1) {
            deferred.reject("Invalid parameters: " + data);
        }
        else {
            User.findOne({mac: data.mac}, function (err, user) {
                if (err)
                    deferred.reject(err);
                else if (!user) {
                    //user not found, register a new one
                    var newUser    = new User();
                    newUser.mac    = data.mac
                    //store the hash of mac into the database
                    newUser.hash   = newUser.generateHash(data.mac);

                    // save the user
                    newUser.save(function (err) {
                        if (err)
                            deferred.reject(err);
                        else 
                            deferred.resolve(newUser);
                    });
                }
                else {
                    deferred.resolve(user);
                }
            });
        }
        return deferred.promise;
    };
}());