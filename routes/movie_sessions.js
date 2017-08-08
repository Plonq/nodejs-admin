var express = require('express');
var router = express.Router();

// For external API calls
var request = require('request');

var API_URL = 'http://localhost/api';

/* Index of sessions (blank table with drop-down to select a movie) */
router.get('/', function(req, res, next) {
    var movies;
    request.get(API_URL+'/movies', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            movies = JSON.parse(body);

            res.render('movie_sessions/index', {
                nav: 'movie_sessions',
                title: 'MI. Movies Admin',
                movies: movies,
                selected_movie: req.query.movie_id,
                message: req.flash('message')
            });
        }
    });
});

/* Route for getting sessions based on a movie FOR AJAX */
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

// Add new movie session form
router.get('/add', function(req, res, next) {
    var cinemas, movies;
    request.get(API_URL+'/cinemas', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            cinemas = JSON.parse(body);

            request.get(API_URL+'/movies', function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    movies = JSON.parse(body);

                    res.render('movie_sessions/create', {
                        nav: 'movie_sessions',
                        title: 'MI. Movies Admin',
                        cinemas: cinemas,
                        movies: movies,
                        selected_movie: req.query.movie_id
                    });
                }
            });
        }
    });
});

// Create new movie session from POST
router.post('/add', function(req, res, next) {
    // We aren't validating here because all inputs are selects or date/time (also running out of time to finish)
    form = {
        scheduled_at: req.body.date + ' ' + req.body.time,
        movie_id: req.body.movie_id,
        cinema_id: req.body.cinema_id
    };
    console.log(form);
    request.post(API_URL+'/movie_sessions', {form: form}, function (error, response, body) {
        if (!error && response.statusCode === 204) {
            req.flash('message', 'Session added successfully');
            res.redirect('/movie_sessions?movie_id='+req.body.movie_id);
        }
        else {
            console.log(error);
            console.log(response.statusCode);
            res.render('error', { message: 'Error with API' });
        }
    });
});

// Edit movie session form
router.get('/edit/:id', function(req, res, next) {
    var cinemas, movies;
    request.get(API_URL+'/cinemas', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            cinemas = JSON.parse(body);

            request.get(API_URL+'/movies', function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    movies = JSON.parse(body);

                    request.get(API_URL+'/movie_sessions/'+req.params.id, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            movie_session = JSON.parse(body);

                            res.render('movie_sessions/edit', {
                                nav: 'movie_sessions',
                                title: 'MI. Movies Admin',
                                cinemas: cinemas,
                                movies: movies,
                                movie_session: movie_session
                            });
                        }
                    });
                }
            });
        }
    });
});

// Update movie session from POST
router.put('/edit/:id', function(req, res, next) {
    // We aren't validating here because all inputs are selects or date/time (also running out of time to finish)
    form = {
        scheduled_at: req.body.date + ' ' + req.body.time,
        movie_id: req.body.movie_id,
        cinema_id: req.body.cinema_id
    };
    console.log(form);
    request.post(API_URL+'/movie_sessions/'+req.params.id, {form: form}, function (error, response, body) {
        if (!error && response.statusCode === 204) {
            req.flash('message', 'Session added successfully');
            res.redirect('/movie_sessions?movie_id='+req.body.movie_id);
        }
        else {
            console.log(error);
            console.log(response.statusCode);
            res.render('error', { message: 'Error with API' });
        }
    });
});

module.exports = router;
