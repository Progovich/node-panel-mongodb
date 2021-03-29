const express = require('express');
const panelController = require('../controllers/panelController');
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, viewsController.goToMainPage)
  .put(panelController.updateDb)
  .delete(panelController.deleteDb);

router.route('/page/:page').get(authController.protect, viewsController.getPanel);

module.exports = router;
