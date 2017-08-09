var express = require('express');
var router = express.Router();

// For external API calls
var request = require('request');

// Login page
router.get('/', function(req, res, next) {
    res.render('login', { title: 'MI. Movies Admin' });
});

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
                req.session.auth = true;
                res.redirect('/');
            }
            else {
                req.session.auth = false;
                res.redirect('/login');
            }
        }
    })
});

module.exports = router;
