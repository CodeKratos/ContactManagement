const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Contact = mongoose.model('Contact');
const passport = require('passport');

module.exports = (app) => {
  app.use('/contact', passport.authenticate('jwt', {session: false}), router);
  // app.use('/contact', router);
};

router.get('/', (req, res, next) => {
  Contact.find({}, (err, contacts) => {
    if (err) {
      next(err);
    }
    res.send(makeResponse(contacts, req.user));
  });
});

router.post('/', (req, res, next) => {
  const contact = new Contact(req.body);
  contact.save((err, contact) => {
    if (err) {
      next(err);
    }
    res.send(makeResponse(contact, req.user));
  });
});

router.get('/:contactId', (req, res, next) => {
  const userId = req.params.userId;
  Contact.findById(userId, (err, contact) => {
    if (err) {
      next(err);
    }
    res.send(makeResponse(contact, req.user));
  });
});

router.put('/:contactId', (req, res, next) => {
  const userId = req.params.userId;
  Contact.findById(userId, (err, contact) => {
    if (err) {
      next(err);
    }
    const updatedUser = Object.assign(contact, req.body);
    updatedUser.save((err, contact) => {
      if (err) {
        next(err);
      }
      res.send(makeResponse(contact, req.user));
    });
  });
});

router.delete('/:contactId', (req, res, next) => {
  const userId = req.params.userId;
  Contact.findOneAndRemove(userId, (err, contact) => {
    if (err) {
      next(err);
    }
    res.send(makeResponse(contact, req.user));
  });
});

function makeResponse(data, loggedInUser) {
  return {
    data: data,
    user: loggedInUser
  };
};