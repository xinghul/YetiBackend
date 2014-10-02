(function () {
    "use strict"
    var mongoose = require("mongoose");
    var Q = require("q");
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
            getNextSequence: function (_id) {
                var deferred = Q.defer();
                modelCounter.findOneAndUpdate(
                    {"_id": _id}, 
                    { $inc: { seq: 1 } }, 
                    {new: true}, 
                    function (err, counter) {
                        if (err) 
                            deferred.reject({success : 0, msg : err});
                        else
                            deferred.resolve(counter.seq);
                    }
                );
                return deferred.promise;
            }
        };
    }());
    exports.getNextSequence = Counter.getNextSequence;
}());