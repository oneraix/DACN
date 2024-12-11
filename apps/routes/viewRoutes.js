//viewRoute.js
const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware'); // Import các middleware



//chung
router.get('/', viewController.renderIndex);  // Khi truy cập trang chủ sẽ render index.ejs
router.get('/login', viewController.renderLogin);
router.get('/register',viewController.renderSignup);
router.get('/roomdetail/:id',viewController.renderRoomDetail);

//host
router.get('/host/createhomestay',viewController.renderCreateHomestay);
router.get('/host/bookingconfirm', viewController.renderBookingConfirm);
router.get('/host', viewController.renderHostIndex);
router.get('/host/myhomestay', viewController.renderMyHomestay);
router.get('/host/profile', viewController.renderProfile);
router.get('/host/rentalhistory', viewController.renderRentHistory);

//admin
router.get('/admin/accepthomestay', viewController.renderAcceptHomestay);
router.get('/admin', viewController.renderAdminIndex);
router.get('/admin/manageaccount', viewController.renderManageAccount);
router.get('/admin/manageblog', viewController.renderManageBlog);
router.get('/admin/managehomestay', viewController.renderManageHomestay);
router.get('/admin/managebooking', viewController.renderManageBooking);


//user
router.get('/user/booking', viewController.renderBooking);
router.get('/user/bookinghistory', viewController.renderBookingHistory);
router.get('/user/favoritehomestay', viewController.rendeFavoriteHomestay);
router.get('/user/payment', viewController.renderPayment);
router.get('/user/profile', viewController.renderUserProfile);


module.exports = router;