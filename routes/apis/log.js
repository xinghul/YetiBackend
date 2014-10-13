(function () {
    "use strict";
    var mongoose = require("mongoose");
    var Q        = require("q");

    var User     = require("../models/user-playtest").User;
    var Log      = require("../models/user-playtest").Log;

    exports.downloadLog = function () {
        var deferred = Q.defer();
        Log.find({}, {}, function (err, logs) {
            if (err)
                deferred.reject(err);
            else
                deferred.resolve(logs); 
        });
        return deferred.promise;
    }

    exports.startNewGame = function (data) {
        var deferred = Q.defer();
        if ([undefined, null].indexOf(data) !== -1 ||
            [undefined, null].indexOf(data.mac) !== -1 ||
            [undefined, null].indexOf(data.hash) !== -1)
            deferred.reject("Invalid parameter: " + data);
        else {
            User.findOne({mac: data.mac, hash: data.hash}, function (err, user) {
                if (err)
                    deferred.reject(err);
                else if (!user)
                    deferred.reject("Validate user failed: " + data);
                else {
                    var log = new Log({
                        start: new Date(),
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
    }

    exports.firstClueTapped = function (data) {
        var deferred = Q.defer();
        if ([undefined, null].indexOf(data)       !== -1 ||
            [undefined, null].indexOf(data.mac)   !== -1 ||
            [undefined, null].indexOf(data.hash)  !== -1 ||
            [undefined, null].indexOf(data._id)   !== -1)
            deferred.reject("Invalid parameter: " + data);
        else {
            User.findOne({ mac: data.mac, hash: data.hash }, function (err, user) {
                if (err)
                    deferred.reject(err);
                else if (!user)
                    deferred.reject("Validate user failed: " + data);
                else {
                    Log.findOne({ user: user._id, _id: data._id }, function (err, log) {
                        if (err)
                            deferred.reject(err);
                        else if (!log) {
                            deferred.reject("Validate log failed: " + data);
                        }
                        else {
                            log.clue = new Date();
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
    }

    exports.firstAnimalTapped = function (data) {
        var deferred = Q.defer();
        if ([undefined, null].indexOf(data)       !== -1 ||
            [undefined, null].indexOf(data.mac)   !== -1 ||
            [undefined, null].indexOf(data.hash)  !== -1 ||
            [undefined, null].indexOf(data._id)   !== -1)
            deferred.reject("Invalid parameter: " + data);
        else {
            User.findOne({ mac: data.mac, hash: data.hash }, function (err, user) {
                if (err)
                    deferred.reject(err);
                else if (!user)
                    deferred.reject("Validate user failed: " + data);
                else {
                    Log.findOne({ user: user._id, _id: data._id }, function (err, log) {
                        if (err)
                            deferred.reject(err);
                        else if (!log) {
                            deferred.reject("Validate log failed: " + data);
                        }
                        else {
                            log.track = new Date();
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
    }

    exports.firstMissionCompleted = function (data) {
        var deferred = Q.defer();
        if ([undefined, null].indexOf(data)       !== -1 ||
            [undefined, null].indexOf(data.mac)   !== -1 ||
            [undefined, null].indexOf(data.hash)  !== -1 ||
            [undefined, null].indexOf(data._id)   !== -1)
            deferred.reject("Invalid parameter: " + data);
        else {
            User.findOne({ mac: data.mac, hash: data.hash }, function (err, user) {
                if (err)
                    deferred.reject(err);
                else if (!user)
                    deferred.reject("Validate user failed: " + data);
                else {
                    Log.findOne({ user: user._id, _id: data._id }, function (err, log) {
                        if (err)
                            deferred.reject(err);
                        else if (!log) {
                            deferred.reject("Validate log failed: " + data);
                        }
                        else {
                            log.mission = new Date();
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
    }

}());
    