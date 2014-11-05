(function () {
    "use strict";
    var mongoose = require('mongoose');

    var Schema   = mongoose.Schema;

    var logSchema = mongoose.Schema({
        user      : {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        beginTime : Date,
        endTime   : Date
    });

    mongoose.model("Log", logSchema);

}());