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
                        genres: genres,
                        errors: req.session.errors
                    });
                }
            });
        }
    });
});

// Create new movie from POST
router.post('/add', function(req, res, next) {
    // Validate
    req.checkBody('title', 'The Title must be between 2 and 30 characters').isLength({min: 2, max: 30});
    req.checkBody('poster_image', 'The Poster Image must be a valid URL').isURL();
    req.checkBody('cover_image', 'The Cover Image must be a valid URL').isURL();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            // There are validation errors
            req.session.errors = result.array();
            // res.redirect('/movies/add');
            res.render('movies/create', {
                nav: 'movies',
                title: 'MI. Movies Admin',
                ratings: ratings,
                genres: genres,
                errors: req.session.errors,
                form_data: req.body
            });
            return;
        }
        req.session.message = 'Movie added successfully';
        res.redirect('/movies', { formdata: req.body });
    });

    console.log(req.body);
});

module.exports = router;
