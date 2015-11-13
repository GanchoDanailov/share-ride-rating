// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');

var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');
var acl = require('acl');
var configDB = require('./config/database.js');

// configuration ===============================================================
//var conn = mongoose.createConnection(configDB.url);
mongoose.connect(configDB.url);


// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
var db = MongoClient.connect(configDB.url, function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});

var mongoBackend = new acl.mongodbBackend(db, 'acl_', true);
acl = new acl(mongoBackend);
console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA", acl);
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser());

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static('public'));
app.use(express.static('app/kor'));
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport, acl); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
