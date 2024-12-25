const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const homestayController = require('../controllers/homestayController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const reviewController = require('../controllers/reviewController');
const authenticateUser = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/paymentController');
const upload = require('../middlewares/uploadMiddleware');

// Xử lý yêu cầu thanh toán


// Định nghĩa route đăng kí, đăng nhập, xác thực
router.post('/login', authController.login);
router.post('/register', authController.register);

// Định nghĩa các route quản lí tài khoản
router.put('/users/profile', authenticateUser(['user','host']), upload.single('profile_picture'), userController.updateProfile);
router.put('/users/change-password', authenticateUser(['user','host']), userController.changePassword);
router.get('/users/profile', authenticateUser(['user','host']), userController.getProfile);
router.get('/user', userController.getAllUsers);  // Lấy danh sách người dùng
router.get('/users/information',authenticateUser (['host', 'user', 'admin']), userController.getUserInformationById);
router.get('/users',authenticateUser('admin'), userController.getAllUsers);// API: Lấy danh sách người dùng với các trường user_id, username, email, status, full_name, address, profile picture
router.put('/users/:id',authenticateUser('admin'), userController.updateUserInfo);// API: Cập nhật thông tin người dùng (bao gồm status, full_name, phone, address)



//homestay
router.get('/homestays/host', authenticateUser(['host', 'admin']), homestayController.getHostHomestays);
router.put('/homestays/approve', authenticateUser(['admin']), homestayController.approveHomestay);
router.get('/homestays/unavailable', authenticateUser('admin') ,homestayController.getUnavailableHomestays);
router.get('/homestay/pending',authenticateUser('admin') ,homestayController.getPendingHomestays);
router.get('/homestay/category', homestayController.getCategory);
router.post('/homestay/create',authenticateUser('host'), upload.array('images', 10), homestayController.createHomestay);
router.get('/homestay', homestayController.getAllHomestays);
router.get('/homestay/:id', homestayController.getHomestayById);
router.put('/homestay/:id', homestayController.updateHomestay);
router.delete('/homestay/:id', homestayController.deleteHomestay);
router.get('/amentities',homestayController.getAllAmenities);
router.post('/homestay/wishlist', authenticateUser(['user']), homestayController.toggleWishlist);
router.get('/searchhomestaysvisitor', homestayController.searchHomestay);
router.get('/searchhomestay', authenticateUser(['host','admin','user']),homestayController.searchHomestay);
router.get('/wishlist', authenticateUser(['user']), userController.getWishlistHomestays);


//booking
router.post('/payments/momo', authenticateUser('user'), paymentController.createMoMoPayment);
router.post('/payments/momo-callback', paymentController.handleMoMoCallback);
router.get('/bookings/dates/:homestayId', bookingController.getBookedDatesByHomestayId);
router.get('/bookingslist', authenticateUser('admin'),bookingController.getAllBookingsForAdmin);
router.get('/bookings/waitingpayment',authenticateUser('user'),bookingController.getBookingWaitingPayment);
router.get('/bookings/pendingbyuser', authenticateUser('user'), bookingController.getPendingBookingsByUserId);
router.put('/bookings/:id/status', authenticateUser(['host', 'user']), bookingController.updateBookingStatus);
router.get('/bookings/pendingbyhost', authenticateUser('host'), bookingController.getPendingBookingsByHostId)
router.post('/bookings',authenticateUser('user'), bookingController.createBooking);
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/:id', bookingController.getBookingById);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id',authenticateUser('admin'), bookingController.deleteBooking);
router.post('/bookings/calculate', bookingController.calculateTotalAmount);

//review
router.get('/check-review-permission',authenticateUser('user'), reviewController.checkReviewPermission);
router.post('/createreviews',authenticateUser('user'), reviewController.createReview);
router.get('/reviews/:homestay_id', reviewController.getReviewsByHomestayId);
//router.get('/reviews/homestay/:homestay_id', reviewController.getReviewsByHomestayId);
router.get('/reviews', reviewController.getReviewsByHomestayName);
router.delete('/reviews/:review_id', reviewController.deleteReviewById);


module.exports = router;
