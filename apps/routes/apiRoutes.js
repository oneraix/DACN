const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const homestayController = require('../controllers/homestayController');
const authController = require('../controllers/authController');

// Định nghĩa route đăng kí, đăng nhập, xác thực
router.post('/login', authController.login);
router.post('/register', authController.register);

// Định nghĩa các route quản lí tài khoản
router.get('/user/getalluser', userController.getAllUsers);  // Lấy danh sách người dùng
//router.post('/user/register', userController.registerUser);  
//router.post('/user/login', userController.loginUser);  

// Định nghĩa các route cho người dùng
router.post('/homestay/createhomestay', homestayController.createHomestay);// Tạo homestay mới
router.get('/homestay/:homestay_id', homestayController.getHomestay);// Lấy homestay theo ID
router.get('/homestay/host/:host_id', homestayController.getHostHomestays);// Lấy tất cả homestay của một chủ nhà
router.put('/homestay/:homestay_id', homestayController.updateHomestay);// Cập nhật homestay
router.delete('/homestay/:homestay_id', homestayController.deleteHomestay);// Xóa homestay

module.exports = router;
