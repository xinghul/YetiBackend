(function () {
    "use strict";
    var mongoose = require('mongoose'),
        bcrypt   = require('bcrypt-nodejs');
        
    var Schema   = mongoose.Schema;

    var entrySchema = mongoose.Schema({
        lid       : Number,
        height    : Number,
        weight    : Number
    }),
    userSchema = mongoose.Schema({
        uid        : Number,
        username   : String,
        password   : String,
        logs       : [{ 
            type: Schema.Types.ObjectId, 
            ref: "Log"
        }],
        unlocked   : [entrySchema]
    });

    // methods ======================
    // generating a hash
    userSchema.methods.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    userSchema.methods.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    // create the model for users and expose it to our app
    mongoose.model('User', userSchema);

}());