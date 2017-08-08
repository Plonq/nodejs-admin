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
    var ratings, genres;
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
                        errors: req.flash('errors'),
                        form_data: req.flash('form_data')[0]
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
    req.checkBody('poster_image_url', 'The Poster Image must be a valid URL').isURL();
    req.checkBody('cover_image_url', 'The Cover Image must be a valid URL').isURL();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            // There are validation errors
            // Redirect back to form, with form data and errors
            req.flash('errors', result.array());
            req.flash('form_data', req.body);
            res.redirect('/movies/add');
            return;
        }

        // Validation passed, send to API
        form = {
            title: req.body.title,
            release_date: req.body.release_date,
            genre_id: req.body.genre_id,
            rating_id: req.body.rating_id,
            poster_image_url: req.body.poster_image_url,
            cover_image_url: req.body.cover_image_url,
            featured: (req.body.featured?'1':'0')
        };
        request.post(API_URL+'/movies', {form: form}, function (error, response, body) {
            if (!error && response.statusCode === 201) {
                movie = JSON.parse(body);
                req.flash('message', 'Movie added successfully');
                res.redirect('/movies/'+movie.id);
            }
            else {
                console.log('error');
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
            res.render('movies/show', {
                nav: 'movies',
                title: 'MI. Movies Admin',
                movie: movie,
                message: req.flash('message')
            });
        }
        else {
            res.render('error', { message: 'Error with API' });
        }
    });
});

// Edit movie form
router.get('/edit/:id', function(req, res, next) {
    var ratings, genres, movie;
    request.get(API_URL+'/ratings', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            ratings = JSON.parse(body);

            request.get(API_URL+'/genres', function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    genres = JSON.parse(body);

                    request.get(API_URL+'/movies/'+req.params.id, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            movie = JSON.parse(body);
                            var form_data = req.flash('form_data');
                            console.log(form_data);
                            if (form_data.length > 0) {
                                movie = form_data[0];
                            }
                            else {
                                movie = JSON.parse(body);
                            }
                            console.log(movie);
                            res.render('movies/edit', {
                                nav: 'movies',
                                title: 'MI. Movies Admin',
                                ratings: ratings,
                                genres: genres,
                                movie: movie,
                                errors: req.flash('errors'),
                            });
                        }
                        else {
                            res.render('error', { message: 'Error with API' });
                        }
                    });
                }
            });
        }
    });
});

// Send edit movie request to API
router.post('/edit/:id', function(req, res, next) {
    // Validate
    req.checkBody('title', 'The Title must be between 2 and 30 characters').isLength({min: 2, max: 30});
    req.checkBody('poster_image_url', 'The Poster Image must be a valid URL').isURL();
    req.checkBody('cover_image_url', 'The Cover Image must be a valid URL').isURL();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            // There are validation errors
            // Redirect back to edit form, with form data and errors
            req.flash('errors', result.array());
            req.flash('form_data', req.body);
            res.redirect('/movies/edit/'+req.params.id);
            return;
        }

        console.log(req.body);
        // return;

        // Validation passed, send to API
        form = {
            title: req.body.title,
            release_date: req.body.release_date,
            genre_id: req.body.genre_id,
            rating_id: req.body.rating_id,
            poster_image_url: req.body.poster_image_url,
            cover_image_url: req.body.cover_image_url,
            featured: (req.body.featured?'1':'0')
        };
        request.put(API_URL+'/movies/'+req.params.id, {form: form}, function (error, response, body) {
            if (!error && response.statusCode === 204) {
                req.flash('message', 'Changes saved');
                res.redirect('/movies/'+req.params.id);
            }
            else {
                res.render('error', { message: 'Error with API' });
            }
        });
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
