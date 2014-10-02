(function () {
    "use strict"
    var express = require('express');
    var Q = require('q');
    var router = express.Router();

    var player = require('./apis/player');
    var animal = require('./apis/animal');
    var dBeacon = require('./apis/dBeacon');

    var responseHandler = function (value) {

    }

    //for player
    router.get('/player', function (req, res) {
        player.getPlayer(req.query.pid).then(function (player) {
            res.json(player);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.get('/players', function (req, res) {
        player.getPlayers().then(function (players) {
            res.json(players);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.post('/players', function (req, res) {
        player.addPlayer(req.body.name).then(function (value) {
            res.json(value);
        }, function (reason) {
            res.json(reason);
        });
    });

    //for animal
    router.get('/animal', function (req, res) {
        animal.getAnimal(req.query.aid).then(function (animal) {
            res.json(animal);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.get('/animals', function (req, res) {
        animal.getAnimals().then(function (animals) {
            res.json(animals);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.post('/animals', function (req, res) {
        animal.addAnimal(req.body.data).then(function (value) {
            res.json(value);
        }, function (reason) {
            res.json(reason);
        });
    });

    

    //for demo
    router.post('/dbeacon/query', dBeacon.query);
    router.post('/dbeacon/update', dBeacon.updateById);
    router.post('/dbeacon/addnode', dBeacon.addNode);
    router.post('/dbeacon/addrls', dBeacon.addRls);
    router.post('/dbeacon/delete', dBeacon.deleteById);

    router.get('/dbeacon/list', dBeacon.getAll);
    router.get('/dbeacon/relation', dBeacon.getRelation);
    router.get('/dbeacon/beacons/:_attr', dBeacon.getAttr);
    router.get('/dbeacon/list/:_type', dBeacon.getType);

    module.exports = router;

}());
    