(function () {
    "use strict";
    var request = require("request");

    var data = {
        x : 21,
        y : 21,
        z : 21
    };

    request.post("http://localhost:3000/api/log/position", {form: { "position": data, "userid": "545a87d82fa64a34f0d2ddcf", "logid": "545a88312fa64a34f0d2ddd2" }}, function (err, httpResponse, body) {
        if (err)
            console.log(err, err.stack);
        else 
            console.log(body);
    });
}())