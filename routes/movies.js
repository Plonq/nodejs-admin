var express = require('express');
var router = express.Router();

// For external API calls
var request = require('request');

var API_URL = 'http://localhost/api';

/* Movies index */
router.get('/', function(req, res, next) {
    var movies = [];
    request.get(API_URL+'/movies', function (error, response, body) {
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
    request.get(API_URL+'/ratings', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            ratings = JSON.parse(body);

            request.get(API_URL+'/genres', function (error, response, body) {
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

            // Render the same page but include the POST data
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

        console.log(req.body);
        // return;

        // Validation passed, send to API
        form = {
            title: req.body.title,
            release_date: req.body.release_date,
            genre_id: req.body.genre,
            rating_id: req.body.rating,
            poster_path: req.body.poster_image,
            cover_path: req.body.cover_image,
            featured: (req.body.featured?'1':'0')
        };
        request.post(API_URL+'/movies', {form: form}, function (error, response, body) {
            if (!error && response.statusCode === 201) {
                movie = JSON.parse(body);
                res.locals.message = 'Movie added successfully';
                res.redirect('/movies/'+movie.id);
            }
            else {
                res.render('error', { message: 'Error with API' });
            }
        });
    });


});

// Movie detail page
router.get('/:id', function(req, res, next) {
    request.get(API_URL+'/movies/'+req.params.id, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            movie = JSON.parse(body);
            res.render('movies/show', { nav: 'movies', title: 'MI. Movies Admin', movie: movie });
        }
        else {
            res.render('error', { message: 'Error with API' });
        }
    });
});

// Delete movie
router.delete('/:id', function(req, res, next) {
    request.delete(API_URL+'/movies/'+req.params.id, function (error, response, body) {
        if (!error && response.statusCode === 204) {
            res.send('success');
        }
        else {
            res.send('fail');
        }
    });
});

module.exports = router;
