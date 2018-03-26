var express = require("express");
var path = require('path');
var logger = require('morgan');
var request = require("request");
var cookieParser = require('cookie-parser');
var config = require("./config.js");
var bodyParser = require("body-parser");
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');

passport.use(new Strategy({
    consumerKey: 'INSERTCONSUMERKEYHERE',
    consumerSecret: 'INSERTCONSUMERSECRETHERE',
    callbackURL: 'http://localhost:3000/twitter/return'
}, function(token, tokenSecret, profile, callback) {
    return callback(null, profile);
}));

passport.serializeUser(function(user, callback) {
	callback(null, user);
});

passport.deserializeUser(function(obj, callback) {
	callback(null, obj);
});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'whatever', resave: true, saveUninitialized: true}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', function(req, res) {
    res.render('index', {user: req.user})
})

app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/search')
})

app.use(logger('dev'));

app.listen(3000);
module.exports=app;