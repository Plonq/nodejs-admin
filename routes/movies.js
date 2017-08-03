var express = require('express');
var router = express.Router();

// For external API calls
var request = require('request');

/* Movies index */
router.get('/', function(req, res, next) {
    var movies = [];
    request.get('http://localhost/api/movies', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            movies = JSON.parse(body);
            res.render('movies/index', { nav: 'movies', title: 'MI. Movies Admin', movies: movies });
        }
        else {
            res.render('error', { message: 'Error with API' });
        }
    });
});

// Add new movie form
router.get('/add', function(req, res, next) {
    request.get('http://localhost/api/ratings', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            ratings = JSON.parse(body);

            request.get('http://localhost/api/genres', function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    genres = JSON.parse(body);

                    res.render('movies/create', {
                        nav: 'movies',
                        title: 'MI. Movies Admin',
                        ratings: ratings,
                        genres: genres
                    });
                }
            });
        }
    });
});

// Create new movie from POST
router.post('/add', function(req, res, next) {
    // Validate
    req.check('title', 'The title is too damn long!').length(5);



    console.log(req.body);
});

module.exports = router;
