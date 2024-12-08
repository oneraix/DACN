//viewRoute.js
const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware'); // Import các middleware



//view chung
router.get('/', viewController.renderIndex);  // Khi truy cập trang chủ sẽ render index.ejs
router.get('/login', viewController.renderLogin);
router.get('/register',viewController.renderSignup);
//router.get('/roomdetail',viewController.renderRoomDetail);
router.get('/roomdetail/:id',viewController.renderRoomDetail);
//view admin


//host
router.get('/host/createhomestay/',viewController.rederCreateHomestay)
//router.get('/host',viewController.renderIndexHost)




module.exports = router;