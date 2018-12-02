var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var fileUpload = require('express-fileupload');
var mongoose=require('mongoose');
var slugUpdater=require('mongoose-slug-updater');
var MongoStore=require('connect-mongodb-session')(session);
//var vhost=require(vhost);




mongoose.plugin(slugUpdater);
async = require("async");

var app = express();

mongoose.Promise=global.Promise;

// Connect database
//var mongo = require('mongodb');
mongoose.connect('mongodb://localhost/sravni');
mongoose.connection.once('open',function(){
  console.log('Connected to the database');
}).on('error',function(error){
  console.log('There is an error: '+error);
});
//var monk = require('monk');
//var db = monk(require('./database.js')());

var store=new MongoStore({
  uri:'mongodb://localhost/sravni',
  collection:'mySessions'
});

store.on('error', function(error) {
  throw error;
});

var User=require('./models/User');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'OpenDataChellenge2018', 
  store: store,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// Make our db accessible to our router
app.use(function(req, res, next){
    //req.db = db;
    res.locals.session = req.session;
    //console.log(req.session);
    next();
});

app.use('/api',require('./api/index'));


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
  console.log('Error: ',err.message);
  res.end();

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(3001, 'localhost');
console.log('now, server is working on localhost:3001');