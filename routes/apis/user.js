(function () {
    "use strict";
    var mongoose = require("mongoose"),
        Q        = require("q");

    var User     = mongoose.model("User"),
        LogEntry = mongoose.model("LogEntry"),
        Counter  = mongoose.model("Counter");

    module.exports = {
        //get a single user info
        getUser : function (uid) {
            var deferred = Q.defer();
            process.nextTick(function () {
                if (!uid)
                    deferred.reject("Please specify the uid for the user.");
                else {
                    User.findOne({uid : uid}, function (err, user) {
                        if (err)
                            deferred.reject(err);
                        else {
                            if ([undefined, null].indexOf(user) !== -1)
                                deferred.reject("The user with uid " + uid + " does not exist!");
                            else 
                                deferred.resolve(user);
                        }
                    });
                }
            });
            return deferred.promise;
        },

        //get all users
        getUsers : function () {
            var deferred = Q.defer();
            User.find({}, {}, function (err, users) {
                if (err)
                    deferred.reject(err);
                else
                    deferred.resolve(users);
            });
            return deferred.promise;
        },

        addUser : function (data) {
            var deferred = Q.defer();
            process.nextTick(function () {
                if ([undefined, null, ''].indexOf(data)          !== -1 ||
                    [undefined, null, ''].indexOf(data.username) !== -1 ||
                    [undefined, null, ''].indexOf(data.password) !== -1)
                    deferred.reject("Missing credentials!");
                else {
                    // find a user whose username is the same as the forms username
                    // we are checking to see if the user trying to login already exists
                    User.findOne({ "username" :  data.username }, function (err, user) {
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

        deleteUser : function (uid) {
            var deferred = Q.defer();
            process.nextTick(function () {
                if ([null, undefined].indexOf(uid) !== -1)
                    deferred.reject("Please specify the uid for the user.");
                else {
                    User.remove({uid: uid}, function (err, result) {
                        if (err)
                            deferred.reject(err);
                        else
                            deferred.resolve(result);
                    });
                }
            });
            return deferred.promise;
        },

        unlockEntry : function (data) {
            var deferred = Q.defer();
            process.nextTick(function () {
                if ([undefined, null, ''].indexOf(data)     !== -1 ||
                    [undefined, null, ''].indexOf(data.uid) !== -1 ||
                    [undefined, null, ''].indexOf(data.lid) !== -1)
                    deferred.reject("Missing credentials!");
                else {
                    User.findOne({_id: data.uid}, function (err, user) {
                        if (err)
                            deferred.reject(err);
                        else if (!user)
                            deferred.reject("Validate user failed: " + data);
                        else {
                            var entry = new LogEntry({
                                lid    : data.lid,
                                weight : data.weight,
                                height : data.height 
                            });
                            entry.save(function (err, newEntry, numberAffected) {
                                if (err)
                                    deferred.reject(err);
                                else {
                                    user.unlocked.push(newEntry);
                                    user.save(function (err, product, numberAffected) {
                                        if (err)
                                            deferred.reject(err);
                                        else 
                                            deferred.resolve(product);
                                    });
                                }
                            });
                        }
                    });
                }
            });
            return deferred.promise;
        }
    };
    
}());
    