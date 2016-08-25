// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var morgan = require('morgan');
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var app = express();
var port = process.env.PORT || 3000;

// configuration ===============================================================
// connect to our database
app.disable('etag');
require('./routes/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(validator());

app.set('view engine', 'ejs'); // set up ejs for templating
app.engine('html', require('ejs').renderFile);

// required for passport
app.use(session({
	secret: 'randomcookiesecret',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));


// routes ======================================================================
require('./routes/login.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/define-routes.js')(app);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
