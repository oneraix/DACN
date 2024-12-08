const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const homestayController = require('../controllers/homestayController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware'); 

// Định nghĩa route đăng kí, đăng nhập, xác thực
router.post('/login', authController.login);
router.post('/register', authController.register);

// Định nghĩa các route quản lí tài khoản
router.get('/user', userController.getAllUsers);  // Lấy danh sách người dùng


//homestay
router.post('/homestay', homestayController.createHomestay);
router.get('/homestay', homestayController.getAllHomestays);
router.get('/homestay/:id', homestayController.getHomestayById);
router.put('/homestay/:id', homestayController.updateHomestay);
router.delete('/homestay/:id', homestayController.deleteHomestay);
router.get('/homestays/search', homestayController.searchHomestay);
router.get('/amentities/',homestayController.getAllAmenities);

//booking
router.post('/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);
router.post('/bookings/calculate', bookingController.calculateTotalAmount);
router.get('/bookings/user/:user_id', bookingController.getBookingsByUserId);


module.exports = router;
