const express = require('express');
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router
  .route('/')
  .get(authController.isLoggedIn, viewsController.getLoginForm)
  .post(authController.login, viewsController.getPanel);

module.exports = router;
