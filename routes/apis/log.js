(function () {
    "use strict";
    var mongoose = require("mongoose");
    var Q        = require("q");

    var User     = mongoose.model("User");
    var Log      = mongoose.model("Log");

    module.exports = {
        beginGame : function(data) {
            var deferred = Q.defer();
            if ([undefined, null].indexOf(data)        !== -1 ||
                [undefined, null].indexOf(data.userid) !== -1)
                deferred.reject("Invalid parameter: " + data);
            else {
                User.findOne({_id: data.userid}, function (err, user) {
                    if (err)
                        deferred.reject(err);
                    else if (!user)
                        deferred.reject("Validate user failed: " + data);
                    else {
                        var log = new Log({
                            beginTime: new Date(),
                            user: user._id
                        });
                        log.save(function (err, product, numberAffected) {
                            if (err)
                                deferred.reject(err);
                            else
                                deferred.resolve(product);
                        });
                    }
                });
            }
            return deferred.promise;
        },
        endGame : function (data) {
            var deferred = Q.defer();
            if ([undefined, null].indexOf(data)        !== -1 ||
                [undefined, null].indexOf(data.userid) !== -1 ||
                [undefined, null].indexOf(data.logid)  !== -1)
                deferred.reject("Invalid parameter: " + data);
            else {
                User.findOne({ _id : data.userid }, function (err, user) {
                    if (err)
                        deferred.reject(err);
                    else if (!user)
                        deferred.reject("Validate user failed: " + data);
                    else {
                        Log.findOne({ user: user._id, _id: data.logid }, function (err, log) {
                            if (err)
                                deferred.reject(err);
                            else if (!log) {
                                deferred.reject("Validate log failed: " + data);
                            }
                            else {
                                log.endTime = new Date();
                                log.save(function (err, product, numberAffected) {
                                    if (err)
                                        deferred.reject(err);
                                    else
                                        deferred.resolve(product);
                                });
                            }
                        })
                        
                    }
                });
            }
            return deferred.promise;
        },
        recordPosition : function (data) {
            var deferred = Q.defer();
            if ([undefined, null].indexOf(data)          !== -1 ||
                [undefined, null].indexOf(data.userid)   !== -1 ||
                [undefined, null].indexOf(data.logid)    !== -1 ||
                [undefined, null].indexOf(data.position) !== -1)
                deferred.reject("Invalid parameter: " + data);
            else {
                User.findOne({ _id : data.userid }, function (err, user) {
                    if (err)
                        deferred.reject(err);
                    else if (!user)
                        deferred.reject("Validate user failed: " + data);
                    else {
                        Log.findOne({ user: user._id, _id: data.logid }, function (err, log) {
                            if (err)
                                deferred.reject(err);
                            else if (!log) {
                                deferred.reject("Validate log failed: " + data);
                            }
                            else {
                                var newPos = data.position;
                                newPos.timestamp = new Date();
                                log.track.push(newPos);
                                log.save(function (err, product, numberAffected) {
                                    if (err)
                                        deferred.reject(err);
                                    else
                                        deferred.resolve(product);
                                });
                            }
                        })
                        
                    }
                });
            }
            return deferred.promise;
        },
        getAll : function () {
            var deferred = Q.defer();
            Log.find({}, {}, function (err, logs) {
                if (err)
                    deferred.reject(err);
                else
                    deferred.resolve(logs); 
            });
            return deferred.promise;
        }
    };
}());
    