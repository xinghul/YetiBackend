(function () {
    "use strict";
    var express      = require('express');
    var app          = express();
    var path         = require('path');
    var favicon      = require('static-favicon');
    var logger       = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser   = require('body-parser');
    var mongoose     = require("mongoose");
    var flash        = require("flash");
    var session      = require("express-session");

    var configDB     = require("./config/database");
    mongoose.connect(configDB.url, function (err) {
        if (!err)
            console.log(configDB.successMsg);
        else
            console.log(err, err.stack);
    });

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(favicon());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());
    app.use(session({ secret: "ILoveTeamYeti" }));
    app.use(flash());
    app.use(express.static(path.join(__dirname, 'public')));

    var routes = require("./routes/index");

    app.use(function (req, res, next) {
        res.setHeader('Last-Modified', (new Date()).toUTCString());
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });

    app.use("/", routes);

    /// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });


    module.exports = app;

}());
    