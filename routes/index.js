(function () {
    "use strict"
    var express = require('express');
    var Q = require('q');
    var router = express.Router();

    var db_name = "yeti";
    var db = require("mongoose").connect("mongodb://127.0.0.1:27017/" + db_name, function (err) {
        if (!err)
            console.log("Connected to database " + db_name);
    });

    var api = require('./api');

    var responseHandler = function (value) {

    }

    /* GET home page. */
    router.get('/', function(req, res) {
      res.render('index', { title: 'Yeti Backend' });
    });

    router.get('/quest', function (req, res) {
        res.render('dbeacon');
    });

    router.get('/player', function (req, res) {
        res.render('player');
    });

    router.get('/animal', function (req, res) {
        res.render('animal');
    });

    router.use('/api', api);

    module.exports = router;

}());
    