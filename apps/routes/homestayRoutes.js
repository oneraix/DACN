// apps/routes/homestayRoutes.js
const express = require('express');
const router = express.Router();
const homestayController = require('../controllers/homestayController');

// Tạo homestay mới
router.post('/', homestayController.createHomestay);

// Lấy homestay theo ID
router.get('/:homestay_id', homestayController.getHomestay);

// Lấy tất cả homestay của một chủ nhà
router.get('/host/:host_id', homestayController.getHostHomestays);

// Cập nhật homestay
router.put('/:homestay_id', homestayController.updateHomestay);

// Xóa homestay
router.delete('/:homestay_id', homestayController.deleteHomestay);

module.exports = router;
