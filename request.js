(function () {
    "use strict";
    var request = require("request");

    var data = {
        "uid"    : "54864d8df5aa0858c69e9322",
        "lid"    : "2",
        "weight" : 400,
        "height" : 150
    };

    request.post("http://localhost:3000/api/user/unlock", { form: data }, function (err, httpResponse, body) {
        if (err)
            console.log(err, err.stack);
        else 
            console.log(body);
    });

    // request.get("http://localhost:3000/api/user?uid=6", function (err, httpResponse, body) {
    //     if (err)
    //         console.log(err, err.stack);
    //     else
    //         console.log(body);
    // });
}())