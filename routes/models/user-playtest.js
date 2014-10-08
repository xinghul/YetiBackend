(function () {
    "use strict";
    var mongoose = require('mongoose');
    var bcrypt   = require('bcrypt-nodejs');
    var Schema   = mongoose.Schema;

    var logSchema = mongoose.Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: "UserTest"
        },
        start: Date,
        clue: Date,
        track: Date,
        mission: Date
    });

    var userSchema = mongoose.Schema({
        mac: String,
        hash: String,
        logs: [{ 
            type: Schema.Types.ObjectId, 
            ref: "Log"
        }]
    });

    // methods ======================
    // generating a hash
    userSchema.methods.generateHash = function (mac) {
        return bcrypt.hashSync(mac, bcrypt.genSaltSync(8), null);
    };

    // checking if mac address is valid
    userSchema.methods.validHash = function (mac) {
        return bcrypt.compareSync(mac, this.hash);
    };

    exports.User = mongoose.model('UserTest', userSchema);
    exports.Log = mongoose.model("Log", logSchema);
}());