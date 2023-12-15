const express = require('express');
const { checkoutBook, returnBook } = require('../controllers/checkoutController');

const checkoutRoutes = (books, checkouts) => {
  const router = express.Router();

  router.post('/checkout/:bookId', (req, res) => checkoutBook(req, res, books, checkouts));
  router.post('/checkout/return-book/:bookId', (req, res) => returnBook(req, res, books, checkouts));

  return router;
};

module.exports = checkoutRoutes;
