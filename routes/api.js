(function () {
    "use strict";
    var express  = require('express');
    var Q        = require('q');
    var router   = express.Router();

    var user     = require('./apis/user');
    var animal   = require('./apis/animal');
    var dBeacon  = require('./apis/dBeacon');
    var auth     = require("./apis/auth");
    var log      = require("./apis/log");

    var responseHandler = function (value) {

    }

    router.get("/", function (req, res) {
        res.send("OK");
    });

    //for player
    router.get('/user', function (req, res) {
        user.getUser(req.query.uid).then(function (user) {
            res.json(user);
        }, function (reason) {
            console.log(reason);
            res.json(reason);
        });
    });

    router.delete('/user/:uid', function (req, res) {
        user.deleteUser(req.params.uid).then(function (value) {
            res.json(value);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.get('/users', function (req, res) {
        user.getUsers().then(function (users) {
            res.json(users);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.post('/users', function (req, res) {
        user.addUser(req.body).then(function (value) {
            res.json(value);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.post("/user/unlock", function (req, res) {
        user.unlockEntry(req.body).then(function (value) {
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

    router.delete('/animal/:aid', function (req, res) {
        animal.deleteAnimal(req.params.aid).then(function (value) {
            res.json(value);
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
        animal.addAnimal(req.body).then(function (value) {
            res.json(value);
        }, function (reason) {
            res.json(reason);
        });
    });

    router.post("/signup", function (req, res) {
        auth.signUp(req.body).then(function (value) {
            res.json({"success": true, "data": value});
        }, function (reason) {
            res.json({"success": false, "msg": reason});
        });
    });

    router.post("/login", function (req, res) {
        auth.logIn(req.body).then(function (value) {
            res.json({"success": true, "data": value});
        }, function (reason) {
            res.json({"success": false, "msg": reason});
        });
    });

    router.post("/log/begingame", function (req, res) {
        log.beginGame(req.body).then(function (value) {
            res.json({ success: true, log: value });
        }, function (reason) {
            res.json({ success: false, msg: reason });
        });
    });

    router.post("/log/endgame", function (req, res) {
        log.endGame(req.body).then(function (value) {
            res.json({ success: true, log: value });
        }, function (reason) {
            res.json({ success: false, msg: reason });
        });
    });

    router.post("/log/position", function (req, res) {
        log.recordPosition(req.body).then(function (value) {
            res.json({ success: true, log: value });
        }, function (reason) {
            res.json({ success: false, msg: reason });
        });
    });

    router.get("/log/download", function (req, res) {
        log.getAll().then(function (value) {
            res.attachment('result.json');
            res.setHeader('Content-Type', 'application/octet-stream');
            res.end(JSON.stringify(value, null, 2), 'utf8');
        }, function (reason) {
            res.json({ success: false, msg: reason});
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
    