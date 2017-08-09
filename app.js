var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var movies = require('./routes/movies');
var movie_sessions = require('./routes/movie_sessions');
var bookings = require('./routes/bookings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());
app.use(session({secret: '{secret}', name: 'session_id', saveUninitialized: true, resave: true}));
app.use(flash());

// Make auth status visible to all views
app.use(function(req, res, next) {
  res.locals.auth = req.session.auth;
  next();
});

// Login route first otherwise redirect loop
app.use('/login', login);

// Auth - redirect to login page if unauthenticated
app.use(function(req, res, next) {
  if (!req.session.auth) {
    res.redirect('/login');
    return;
  }
  else {
    next();
  }
});

// Logout
app.use('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/login');
  return;
});

// Standard routes
app.use('/', index);
app.use('/users', users);
app.use('/movies', movies);
app.use('/movie_sessions', movie_sessions);
app.use('/bookings', bookings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
