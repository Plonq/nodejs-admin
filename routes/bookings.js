var express = require('express');
var router = express.Router();

// For external API calls
var request = require('request');

var API_URL = 'http://localhost/api';

/* Bookings index. */
router.get('/', function(req, res, next) {
    var bookings;
    var movies;
    var movie_sessions;
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

/* AJAX: All bookings. */
router.post('/', function(req, res, next) {
    var bookings;
    request.get(API_URL+'/bookings', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            bookings = JSON.parse(body);

            res.send(bookings);
        }
        else if(response.statusCode === 204) {
            res.send('no results');
        }
    });
});

/* AJAX: Bookings by movie. */
router.post('/by_movie/:movie_id', function(req, res, next) {
    var bookings;
    request.get(API_URL+'/bookings/by_movie/'+req.params.movie_id, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            bookings = JSON.parse(body);

            res.send(bookings);
        }
        else if(response.statusCode === 204) {
            res.send('no results');
        }
    });
});

/* AJAX: Bookings by movie session. */
router.post('/by_movie_session/:movie_session_id', function(req, res, next) {
    var bookings;
    request.get(API_URL+'/bookings/by_movie_session/'+req.params.movie_session_id, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            bookings = JSON.parse(body);

            res.send(bookings);
        }
        else if(response.statusCode === 204) {
            res.send('no results');
        }
    });
});


module.exports = router;
