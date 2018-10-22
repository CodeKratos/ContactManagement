const express = require('express');

const jwt = require('jsonwebtoken');
const passport = require('passport');

const SECRET = 'your_jwt_secret';

module.exports = (app) => {
  app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        session: false
      }, (err, user, info) => {
        console.log(err);
        if (err || !user) {
          return res.status(400).json({
            message: info ? info.message : 'Login failed',
            user: user
          });
        }

        req.login(user, {
          session: false
        }, (err) => {
          if (err) {
            res.send(err);
          }

          const token = jwt.sign(user, SECRET);

          return res.json({
            user,
            token
          });
        });
      })
      (req, res);

  });
};
