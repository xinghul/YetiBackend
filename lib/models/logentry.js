(function () {
    "use strict";
    var mongoose = require("mongoose");

    var Schema   = mongoose.Schema;

    var entrySchema = mongoose.Schema({
        user      : {
            type  : Schema.Types.ObjectId,
            ref   : "User"
        },
        lid       : Number,
        height    : Number,
        weight    : Number
    });

    mongoose.model("LogEntry", entrySchema);

}());