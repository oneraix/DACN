// apps/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Định nghĩa các route cho người dùng
router.get('/', userController.getAllUsers);  // Sử dụng GET để lấy tất cả người dùng
router.post('/register', userController.registerUser);  // Đổi thành registerUser
router.post('/login', userController.loginUser);  // Đổi thành loginUser



module.exports = router;
