var express = require('express');
var router = express.Router();

// For external API calls
var request = require('request');

/*
 * Use Laravel API to check creds.
 * Redirect to /movies on success.
 */
router.post('/', function(req, res, next) {
    var form = {
        email: req.body.email,
        password: req.body.password
    };
    request.post('http://localhost/api/login', {form: form}, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            if (data.result === 'success') {
                console.log('Auth succeeded');
                res.redirect('/movies');
            }
            else {
                res.redirect('/');
            }
        }
    })
});

module.exports = router;
