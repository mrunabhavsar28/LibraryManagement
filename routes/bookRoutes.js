// routes/bookRoutes.js
const express = require('express');
const { getBooks, getBookById, addBook, updateBook, partialUpdateBook } = require('../controllers/bookController');

const bookRoutes = (books, checkouts, authorizeAdmin) => {
  const router = express.Router();

  router.get('/books', getBooks(books));
  router.get('/books/:bookId', getBookById(books));
  router.post('/book', authorizeAdmin, (req, res) => addBook(req, res, books));
  router.put('/book/:bookId', authorizeAdmin, (req, res) => updateBook(req, res, books));
  router.patch('/book/:bookId', authorizeAdmin, (req, res) => partialUpdateBook(req, res, books));

  return router;
};

module.exports = bookRoutes;
