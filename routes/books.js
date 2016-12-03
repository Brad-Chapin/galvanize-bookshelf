'use strict';

const express = require('express');
const {decamelizeKeys, camelizeKeys} = require('humps');
const knex = require('../knex');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy("title")
    .then((books) => {
      res.send(camelizeKeys(books));
      res.status("200");
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  knex('books')
    .where("id", req.params.id)
    .first()
    .then((books) => {
      if (!books){
        return next();
      }
      res.send(camelizeKeys(books));
      res.status("200");
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  knex("books")
  .insert({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  }, "*")
  .then((books) => {
    res.send(camelizeKeys(books[0]));
  })
  .catch((err) =>{
    next (err);
  });
});

router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((books) => {
      if (!books) {
        return next();
      }
      return knex('books')
        .update({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          description: req.body.description,
          cover_url: req.body.coverUrl
        }, '*')
        .where('id', req.params.id);
    })
    .then((books) => {
      res.send(camelizeKeys(books[0]));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  let books;

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }
      books = row;
      return knex('books')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete books.id;
      res.send(camelizeKeys(books));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
