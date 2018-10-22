const express = require('express');
const glob = require('glob');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');

const passport = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

const EMAIL = "vaisakhb12@gmail.com";
const PASSWORD = "12345678p";
const SECRET = 'your_jwt_secret';

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, cb) => {
      if (email === EMAIL && password === "PASSWORD") {
        const user = {
          email: EMAIL
        }
        return cb(null, user, {
          message: 'Logged In Successfully'
        });
      } else {
        return cb(null, false, {
          message: 'Incorrect email or password.'
        });
      }
    }
  ));

  passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET
    },
    (jwtPayload, cb) => {
      if (jwtPayload.email = EMAIL) {
        return cb(null, {
          email: jwtPayload.email
        });
      } else {
        return cb(new Error("Token corrupted."));
      }
    }
  ));

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

  return app;
};
