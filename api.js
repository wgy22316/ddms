var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var restify = require('express-restify-mongoose');
var dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/ddms_db';
var db = mongoose.connect(dbUrl, {safe: true});

var models = require('./models');
var apis = require('./apis/index');


var app = express();
app.enable('trust proxy');
app.locals.appTitle = "DDMS";

app.use(function (req, res, next) {
  if (!models.Form) return next(new Error("No models."));
  req.models = models;
  return next();
});

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(methodOverride());
app.use(favicon(__dirname + '/public/images/favicon.ico'));

//user
//app.get('/apis/v1/users', apis.user.getUsers);

//form
app.get('/apis/v1/form', apis.form.getForm);

//form data
app.get('/apis/v1/formdata', apis.formData.getDataByFormId);
app.post('/apis/v1/formdata', apis.formData.postDataByFormId);


/**
//restify API
//for debug only
var router = express.Router();
restify.serve(router, models.User);
restify.serve(router, models.AdminLog);
restify.serve(router, models.Form);
restify.serve(router, models.FormData);
app.use(router);
//*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
