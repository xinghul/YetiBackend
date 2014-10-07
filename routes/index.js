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

    

    var isLoggedIn = function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect("/")
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

    router.get("/login", function (req, res) {
        res.render("login", { message: req.flash("loginMessage") });
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    router.get("/signup", function (req, res) {
        res.render("signup", { message: req.flash("signupMessage") });
    });

    router.post("/signup", passport.authenticate("local-signup", {
        successRedirect : "/profile", // redirect to the secure profile section
        failureRedirect : "/signup", // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    router.get("/profile", isLoggedIn, function (req, res) {
        res.render("profile", {
            user: req.user
        });
    });

    router.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    router.use('/api', api);

    module.exports = router;
}());

    