const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

// Định nghĩa route cho trang chủ
router.get('/', viewController.renderIndex);  // Khi truy cập trang chủ sẽ render index.ejs

module.exports = router;