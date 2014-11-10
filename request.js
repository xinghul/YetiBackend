(function () {
    "use strict";
    var request = require("request");

    var data = {
        "x"      : 31,
        "y"      : 31,
        "z"      : 31,
        "userid" : "545a87d82fa64a34f0d2ddcf",
        "logid"  : "545a88312fa64a34f0d2ddd2"
    };

    request.post("http://localhost:3000/api/log/position", { form: data }, function (err, httpResponse, body) {
        if (err)
            console.log(err, err.stack);
        else 
            console.log(body);
    });
}())