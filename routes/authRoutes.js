const express = require('express');
const { signUp, signIn } = require('../controllers/authController');

const authRoutes = (users, config) => {
  const router = express.Router();

  router.post('/signUp', (req, res) => signUp(req, res, users, config));
  router.post('/signIn', (req, res) => signIn(req, res, users, config));

  return router;
};

module.exports = authRoutes;
