var app = app || {};

(function () {

    app.setRequestHeader = function setRequestHeader(req) {

        var auth = getCurrentAuthentificationBase64();

        if (auth != null) {

            req.setRequestHeader('Authorization', "Basic " + auth);

        }



    }
})()