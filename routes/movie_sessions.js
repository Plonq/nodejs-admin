var express = require('express');
var router = express.Router();

// For external API calls
var request = require('request');

var API_URL = 'http://localhost/api';

/* Index of sessions (blank table with drop-down to select a movie) */
router.get('/', function(req, res, next) {
    var movies;
    var movie_sessions;
    request.get(API_URL+'/movies', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            movies = JSON.parse(body);

            res.render('movie_sessions/index', {
                nav: 'movie_sessions',
                title: 'MI. Movies Admin',
                movies: movies
            });
        }
    });
});

/* Route for getting sessions based on a movie */
router.post('/by_movie/:id', function(req, res, next) {
    var movie_sessions;
    request.get(API_URL+'/movie_sessions/by_movie/'+req.params.id, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            movie_sessions = JSON.parse(body);

            res.send(movie_sessions);
        }
    });
});

// Delete movie session
router.delete('/:id', function(req, res, next) {
    request.delete(API_URL+'/movie_sessions/'+req.params.id, function (error, response, body) {
        if (!error && response.statusCode === 204) {
            res.send('success');
        }
        else {
            res.send('fail');
        }
    });
});

module.exports = router;
