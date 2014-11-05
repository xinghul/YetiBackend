(function () {
    "use strict";
    var mongoose = require('mongoose'),
        bcrypt   = require('bcrypt-nodejs');
        
    var Schema   = mongoose.Schema;

    var userSchema = mongoose.Schema({

        local            : {
            email        : String,
            password     : String,
        },
        logs: [{ 
            type: Schema.Types.ObjectId, 
            ref: "Log"
        }]
    });

    // methods ======================
    // generating a hash
    userSchema.methods.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    userSchema.methods.validPassword = function (password) {
        return bcrypt.compareSync(password, this.local.password);
    };

    // create the model for users and expose it to our app
    mongoose.model('User', userSchema);

}());