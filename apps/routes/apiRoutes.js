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
const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');
const path = require('path');
const config = require(path.join(__dirname, '..', 'config', 'default.json'));





// Xử lý yêu cầu thanh toán
router.post('/payments/momo', authenticateUser('user'), paymentController.createMoMoPayment);
router.post('/payments/momo-callback', paymentController.handleMoMoCallback);

router.post('/payments/vnpay/create_payment_url', (req, res) => {
    try {
      const { bookingId, totalAmount } = req.body;
      console.log('Creating VNPay payment URL...');
      console.log('Request body:', req.body);
  
      const tmnCode = config['vnp_TmnCode'];
      const secretKey = config['vnp_HashSecret'];
      const vnpUrl = config['vnp_Url'];
      const returnUrl = config['vnp_ReturnUrl'];
      const ipnUrl = config['vnp_IpnUrl'];
      const createDate = moment().format('YYYYMMDDHHmmss');
      const orderId = `${bookingId}_${Date.now()}`;
  
      const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Payment for booking ${bookingId}`,
        vnp_OrderType: 'other',
        vnp_Amount: totalAmount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpnUrl: ipnUrl,
        vnp_CreateDate: createDate,
        vnp_IpAddr: req.ip,
      };
  
      console.log('VNPay Params before sorting:', vnp_Params);
  
      // Sắp xếp tham số theo thứ tự tăng dần
      const sortedParams = Object.keys(vnp_Params)
        .sort()
        .reduce((acc, key) => {
          acc[key] = vnp_Params[key];
          return acc;
        }, {});
  
      console.log('VNPay Params after sorting:', sortedParams);
  
      // Tạo chuỗi chữ ký bảo mật
      const signData = querystring.stringify(sortedParams, { encode: false });
      console.log('Sign Data:', signData);
  
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
      console.log('Generated Secure Hash:', signed);
  
      sortedParams.vnp_SecureHash = signed;
  
      const paymentUrl = `${vnpUrl}?${querystring.stringify(sortedParams, { encode: false })}`;
      console.log('Payment URL:', paymentUrl);
  
      res.status(200).json({ paymentUrl });
    } catch (error) {
      console.error('Error creating VNPay payment URL:', error.message);
      res.status(500).json({ message: 'Failed to create VNPay payment URL' });
    }
  });
  
  // VNPay: Xử lý khi người dùng quay lại từ VNPay
  router.get('/payments/vnpay/vnpay_return', (req, res) => {
    try {
      console.log('Processing VNPay return...');
      console.log('Query Params:', req.query);
  
      const vnp_Params = req.query;
      const secureHash = vnp_Params['vnp_SecureHash'];
  
      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];
  
      const sortedParams = Object.keys(vnp_Params)
        .sort()
        .reduce((acc, key) => {
          acc[key] = vnp_Params[key];
          return acc;
        }, {});
  
      console.log('Sorted Params:', sortedParams);
  
      const signData = querystring.stringify(sortedParams, { encode: false });
      const secretKey = config['vnp_HashSecret'];
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
      console.log('Generated Secure Hash for return:', signed);
  
      if (secureHash === signed) {
        const responseCode = vnp_Params['vnp_ResponseCode'];
        console.log('Response Code:', responseCode);
  
        if (responseCode === '00') {
          res.status(200).json({ message: 'Payment successful', details: vnp_Params });
        } else {
          res.status(400).json({ message: 'Payment failed', details: vnp_Params });
        }
      } else {
        console.error('Invalid signature for VNPay return.');
        res.status(400).json({ message: 'Invalid signature', details: vnp_Params });
      }
    } catch (error) {
      console.error('Error processing VNPay return:', error.message);
      res.status(500).json({ message: 'Error processing VNPay return' });
    }
  });
  
  // VNPay: Xử lý callback từ VNPay
  router.get('/payments/vnpay/vnpay_ipn', (req, res) => {
    try {
      console.log('Processing VNPay IPN...');
      console.log('Query Params:', req.query);
  
      const vnp_Params = req.query;
      const secureHash = vnp_Params['vnp_SecureHash'];
  
      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];
  
      const sortedParams = Object.keys(vnp_Params)
        .sort()
        .reduce((acc, key) => {
          acc[key] = vnp_Params[key];
          return acc;
        }, {});
  
      console.log('Sorted Params for IPN:', sortedParams);
  
      const signData = querystring.stringify(sortedParams, { encode: false });
      const secretKey = config['vnp_HashSecret'];
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
      console.log('Generated Secure Hash for IPN:', signed);
  
      if (secureHash === signed) {
        const responseCode = vnp_Params['vnp_ResponseCode'];
        console.log('Response Code:', responseCode);
  
        if (responseCode === '00') {
          console.log('Transaction successful.');
          res.status(200).json({ RspCode: '00', Message: 'Success' });
        } else {
          console.log('Transaction failed.');
          res.status(400).json({ RspCode: '01', Message: 'Transaction failed' });
        }
      } else {
        console.error('Invalid signature for VNPay IPN.');
        res.status(400).json({ RspCode: '97', Message: 'Invalid signature' });
      }
    } catch (error) {
      console.error('Error processing VNPay IPN:', error.message);
      res.status(500).json({ message: 'Error processing VNPay IPN' });
    }
  });


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
router.post('/homestay/category', homestayController.addCategory);
router.put('/homestay/category/:id', homestayController.updateCategory);
router.delete('/homestay/category/:id', homestayController.deleteCategory);
router.get('/homestays/host', authenticateUser(['host', 'admin']), homestayController.getHostHomestays);
router.put('/homestays/approve', authenticateUser(['admin']), homestayController.approveHomestay);
router.get('/homestays/unavailable', authenticateUser('admin') ,homestayController.getUnavailableHomestays);
router.get('/homestay/pending',authenticateUser('admin') ,homestayController.getPendingHomestays);
router.get('/homestay/category', homestayController.getCategory);
router.post('/homestay/create',authenticateUser('host'), upload.array('images', 10), homestayController.createHomestay);
router.get('/homestay', homestayController.getAllHomestays);
router.get('/homestay/:id', homestayController.getHomestayById);
router.put('/homestay/:id', homestayController.updateHomestay);
router.delete('/homestay/:id',authenticateUser('admin') ,homestayController.deleteHomestay);
router.get('/amentities',homestayController.getAllAmenities);
router.post('/homestay/wishlist', authenticateUser(['user']), homestayController.toggleWishlist);
router.get('/searchhomestaysvisitor', homestayController.searchHomestay);
router.get('/searchhomestay', authenticateUser(['host','admin','user']),homestayController.searchHomestay);
router.get('/wishlist', authenticateUser(['user']), userController.getWishlistHomestays);


//booking
router.get('/bookings/paid',authenticateUser('user'), bookingController.getBookingPaidedByUserId);
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
