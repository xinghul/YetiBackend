var mongoose = require('mongoose');
var db_name = "yeti";
var db = mongoose.connect("mongodb://127.0.0.1:27017/" + db_name, function (err) {
    if (!err)
        console.log("Connected to database " + db_name);
});

var Player = (function () {
    var playerSchema = mongoose.Schema({
        pid: {
            type: Number,
            default: -1
        },
        name: {
            type: String,
            default: ""
        },
        playtime: {
            type: Number,
            default: 0
        },
        status: {
            type: Number,
            default: 0
        },
        achievements: [Number],
        points: {
            type: Number,
            default: 0
        },
    });

    return mongoose.model('Player', playerSchema);
}());

var Counter = (function () {
    var counterSchema = mongoose.Schema({
        _id: {
            type: String,
            default: ""
        },
        seq: {
            type: Number,
            default: 0
        }
    });

    var modelCounter = mongoose.model('Counter', counterSchema);

    return {
        getNextSequence: function (_id, __next) {
            modelCounter.findOneAndUpdate(
                {"_id": _id}, 
                { $inc: { seq: 1 } }, 
                {new: true}, 
                function (err, counter) {
                    if (err) console.log(err);
                    else
                        __next(counter.seq);
                }
            );
        }
    };
}());

exports.GetPlayer = function() {
    return function (req, res) {
        var pid = req.query.pid;
        if (!pid)
            res.json({success : 0, msg : "Please specify the pid for the player."});
        else {
            Player.findOne({pid : pid}, function (err, player) {
                if (!err)
                    res.json(player)
                else 
                    res.json({success : 0, msg : "Error occurs when trying to retrieve the player."});
            });
        }
    }
}

exports.GetPlayers = function() {
    return function (req, res) {
        Player.find({}, {}, function (err, players) {
            if (!err)
                res.json(players);
            else
                res.json({success : 0, msg : "Error occurs when trying to retrieve the players."});
        });
    }
}

exports.AddPlayer = function() {
    return function (req, res) {
        var name = req.body.name;
        if ([null, undefined].indexOf(name) != -1) 
            res.json({success : 0, msg : "Please specify the name for the player."})
        var player = new Player({
            'name': name,
            'playtime': 0,
            'status': 0,
            'achievements': [],
            'points': 0
        });
        Counter.getNextSequence('player', function (pid) {
            player.pid = pid;
            player.save(function (err, product, numberAffected) {
                if (err) 
                    console.log(err);
                else
                    res.json(product);
            });
        });
    }
}



