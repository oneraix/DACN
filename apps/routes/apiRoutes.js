const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const homestayController = require('../controllers/homestayController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const reviewController = require('../controllers/reviewController');
const authenticateUser = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/paymentController');

// Xử lý yêu cầu thanh toán
router.post('/bookings/pay', authenticateUser('user'), paymentController.createPayment);
router.get('/vnpay/callback',  authenticateUser('user'),paymentController.handleVNPayReturn);// Xử lý callback từ VNPay sau khi thanh toán

// Định nghĩa route đăng kí, đăng nhập, xác thực
router.post('/login', authController.login);
router.post('/register', authController.register);

// Định nghĩa các route quản lí tài khoản
router.get('/user', userController.getAllUsers);  // Lấy danh sách người dùng
router.get('/users/image/:id', userController.getUserImageById);
router.get('/users',authenticateUser('admin'), userController.getAllUsers);// API: Lấy danh sách người dùng với các trường user_id, username, email, status, full_name, address, profile picture
router.put('/users/:id',authenticateUser('admin'), userController.updateUserInfo);// API: Cập nhật thông tin người dùng (bao gồm status, full_name, phone, address)



//homestay
router.post('/homestay', homestayController.createHomestay);
router.get('/homestay', homestayController.getAllHomestays);
router.get('/homestay/:id', homestayController.getHomestayById);
router.put('/homestay/:id', homestayController.updateHomestay);
router.delete('/homestay/:id', homestayController.deleteHomestay);
router.get('/amentities',homestayController.getAllAmenities);
router.get('/searchhomestay', homestayController.searchHomestay);

//booking
router.get('/bookingslist', authenticateUser('admin'),bookingController.getAllBookingsForAdmin);
router.get('/bookings/waitingpayment',authenticateUser('user'),bookingController.getBookingWaitingPayment);
router.get('/bookings/pendingbyuser', authenticateUser('user'), bookingController.getPendingBookingsByUserId);
router.put('/bookings/:id/status', authenticateUser(['host', 'user']), bookingController.updateBookingStatus);
router.get('/bookings/pendingbyhost', authenticateUser('host'), bookingController.getPendingBookingsByHostId);
router.post('/bookings',authenticateUser('user'), bookingController.createBooking);
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id',authenticateUser('admin'), bookingController.deleteBooking);
router.post('/bookings/calculate', bookingController.calculateTotalAmount);

//review
router.post('/createreviews', reviewController.createReview);
router.get('/reviews/homestay/:homestay_id', reviewController.getReviewsByHomestayId);
router.get('/reviews', reviewController.getReviewsByHomestayName);
router.delete('/reviews/:review_id', reviewController.deleteReviewById);


module.exports = router;
