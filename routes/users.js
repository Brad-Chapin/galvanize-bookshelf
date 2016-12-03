'use strict';

const express = require('express');
const {decamelizeKeys, camelizeKeys} = require('humps');
const knex = require('../knex');
const bcrypt = require ("bcrypt-as-promised");

// eslint-disable-next-line new-cap
const router = express.Router();

router.post("/users", (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
  .then ((hash) => {
    knex("users")
    .insert({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      hashed_password: hash
    }, "*")
    .then((users) => {
      delete users[0].hashed_password;
      res.send(camelizeKeys(users[0]));
    })
    .catch((err) => {
      next(err);
    });
  });
});

module.exports = router;
