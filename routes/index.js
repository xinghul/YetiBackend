(function () {
    "use strict";
    var express  = require('express');
    var Q        = require('q');
    var passport = require("passport");
    var api      = require('./api');

    var router   = express.Router();
    require('../config/passport')(passport);
    router.use(passport.initialize());
    router.use(passport.session());

    

    // var isLoggedIn = function (req, res, next) {
    //     if (req.isAuthenticated())
    //         return next();
    //     res.redirect("/")
    // }

    /* GET home page. */
    router.get('/', function (req, res) {
        res.render('index', { title: 'Yeti Backend' });
    });

    router.get("/about", function (req, res) {
        res.render("about");
    })

    router.get('/quest', function (req, res) {
        res.render('dbeacon');
    });

    router.get('/user', function (req, res) {
        res.render('user');
    });

    router.get('/animal', function (req, res) {
        res.render('animal');
    });

    router.get("/game", function (req, res) {
        res.render("game");
    });

    router.get("/log", function (req, res) {
        res.render("log");
    });

    router.get("/log/:name", function (req, res) {
        res.render("log/" + req.params.name);
    });

    router.get("/login", function (req, res) {
        console.log("login");
        res.render("login");
    });

    router.get("/signup", function (req, res) {
        console.log("signup");
        res.render("signup");
    });

    router.use('/api', api);

    module.exports = router;
}());

    