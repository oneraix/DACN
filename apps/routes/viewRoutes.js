const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

//view chung
router.get('/', viewController.renderIndex);  // Khi truy cập trang chủ sẽ render index.ejs
router.get('/login', viewController.renderLogin);
router.get('/register',viewController.renderSignup);

//view admin

module.exports = router;