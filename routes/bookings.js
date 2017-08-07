var express = require('express');
var router = express.Router();

// For external API calls
var request = require('request');

var API_URL = 'http://localhost/api';

/* Bookings index. */
router.get('/', function(req, res, next) {
    var bookings = [];
    var movies = [];
    var movie_sessions = [];
    request.get(API_URL+'/bookings', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            bookings = JSON.parse(body);

            request.get(API_URL+'/movies', function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    movies = JSON.parse(body);

                    res.render('bookings/index', {
                        nav: 'bookings',
                        title: 'MI. Movies Admin',
                        bookings: bookings,
                        movies: movies,
                        movie_sessions: movie_sessions
                    });
                }
            });
        }
    });
});

module.exports = router;
