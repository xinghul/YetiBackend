(function () {
    "use strict"
    var mongoose = require("mongoose");
    var Counter = require("../models/counter");
    var Q = require("q")

    var Player = (function () {
        var playerSchema = mongoose.Schema({
            pid: {
                type: Number,
                default: -1
            },
            name: {
                type: String,
                default: ""
            },
            playtime: {
                type: Number,
                default: 0
            },
            status: {
                type: Number,
                default: 0
            },
            achievements: [Number],
            points: {
                type: Number,
                default: 0
            },
        });

        return mongoose.model('Player', playerSchema);
    }());

    exports.getPlayer = function (pid) {
        var deferred = Q.defer();
        if (!pid)
            deferred.reject({success : 0, msg : "Please specify the pid for the player."});
        else {
            Player.findOne({pid : pid}, function (err, player) {
                if (err)
                    deferred.reject({success : 0, msg : err});
                else {
                    if (player === null)
                        deferred.reject({success : 0, msg : "The player with pid " + pid + " does not exist!"});
                    else
                        deferred.resolve(player);
                }
            });
        }
        return deferred.promise;
    }

    exports.getPlayers = function () {
        var deferred = Q.defer();
        Player.find({}, {}, function (err, players) {
            if (err)
                deferred.reject({success : 0, msg : err});
            else
                deferred.resolve(players);
        });
        return deferred.promise;
    }

    exports.addPlayer = function (name) {
        var deferred = Q.defer();
        if ([null, undefined].indexOf(name) != -1) 
            res.json({success : 0, msg : "Please specify the name for the player."})
        var player = new Player({
            'name': name,
            'playtime': 0,
            'status': 0,
            'achievements': [],
            'points': 0
        });
        Counter.getNextSequence('player').then(function (pid) {
            player.pid = pid;
            player.save(function (err, product, numberAffected) {
                if (err) 
                    deferred.reject({success : 0, msg : err});
                else
                    deferred.resolve(product);
            });
        });
        return deferred.promise;
    }
}())
    