(function () {
    "use strict";
    var mongoose = require("mongoose");

    var Schema   = mongoose.Schema;

    var logSchema = mongoose.Schema({
        user      : {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        track     : [{
            x         : String,
            y         : String,
            z         : String,
            timestamp : Date
        }],
        beginTime : Date,
        endTime   : Date
    });

    mongoose.model("Log", logSchema);

}());