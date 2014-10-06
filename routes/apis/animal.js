(function () {
    "use strict";
    var mongoose = require("mongoose");
    var Counter = require("../models/counter");
    var Q = require("q");

    var Animal = (function () {
        var animalSchema = mongoose.Schema({
            aid: {
                type: Number,
                default: -1
            },
            name: {
                type: String,
                default: ""
            },
            model: {
                type: String,
                default: "Unknown"
            },
            category: {
                type: String,
                default: "Unknown"
            },
            diet: {
                type: String,
                default: "Unknown"
            },
            sound: {
                type: String,
                default: "Unknown"
            },
            minweight: {
                type: Number,
                default: 0
            },
            maxweight: {
                type: Number,
                default: 0
            },
            minheight: {
                type: Number,
                default: 0
            },
            maxheight: {
                type: Number,
                default: 0
            }
        });
        return mongoose.model('Animal', animalSchema);
    }());

    exports.getAnimal = function (aid) {
        var deferred = Q.defer();
        if (!aid)
            deferred.reject({success : 0, msg : "Please specify the aid for the animal."});
        else {
            Animal.findOne({aid : aid}, function (err, animal) {
                if (err)
                    deferred.reject({success : 0, msg : err});
                else {
                    if (animal === null)
                        deferred.reject({success : 0, msg : "The animal with aid " + aid + " does not exist!"});
                    else
                        deferred.resolve(animal);
                }
            });
        }
        return deferred.promise;
    }

    exports.getAnimals = function () {
        var deferred = Q.defer();
        Animal.find({}, {}, function (err, animals) {
            if (err)
                deferred.reject({success : 0, msg : err});
            else
                deferred.resolve(animals);
        });
        return deferred.promise;
    }

    exports.addAnimal = function (data) {
        var deferred = Q.defer();
        if ([null, undefined].indexOf(data.name) !== -1) 
            deferred.reject({success: 0, msg: "Please specify the name for the animal."});
        else {
            var animal = new Animal(data);
            Counter.getNextSequence('animal').then(function (aid) {
                animal.aid = aid;
                animal.save(function (err, product, numberAffected) {
                    if (err) 
                        deferred.reject({success : 0, msg : err});
                    else
                        deferred.resolve(product);
                });
            });
        }
        return deferred.promise;
    }

    exports.deleteAnimal = function (aid) {
        var deferred = Q.defer();
        if ([null, undefined].indexOf(aid) !== -1)
            deferred.reject({success: 0, msg: "Please specify the aid for the animal."});
        else {
            Animal.remove({aid: aid}, function (err, result) {
                if (err)
                    deferred.reject(err);
                else
                    deferred.resolve(result);
            });
        }
        return deferred.promise;
    }
}());
    