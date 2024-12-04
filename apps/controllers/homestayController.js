// apps/controllers/homestayController.js
const Homestay = require('../models/homestayModel');

// Tạo homestay mới
exports.createHomestay = (req, res) => {
  const { host_id, name, description, location, price, amenities, images } = req.body;

  Homestay.create(host_id, name, description, location, price, amenities, images, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(201).json({ message: 'Homestay created successfully' });
  });
};

// Lấy homestay theo ID
exports.getHomestay = (req, res) => {
  const { homestay_id } = req.params;

  Homestay.getById(homestay_id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Homestay not found' });
    }
    res.json(result[0]);
  });
};

// Lấy tất cả homestay của một chủ nhà
exports.getHostHomestays = (req, res) => {
  const { host_id } = req.params;

  Homestay.getByHostId(host_id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(result);
  });
};

// Cập nhật thông tin homestay
exports.updateHomestay = (req, res) => {
  const { homestay_id } = req.params;
  const { name, description, location, price, amenities, images, available } = req.body;

  // Kiểm tra nếu thông tin bắt buộc không có
  if (!name || !description || !location || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Cập nhật homestay
  Homestay.update(homestay_id, name, description, location, price, amenities, images, available, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Homestay not found' });
    }
    res.status(200).json({ message: 'Homestay updated successfully' });
  });
};

// Xóa homestay
exports.deleteHomestay = (req, res) => {
  const { homestay_id } = req.params;

  // Xóa homestay
  Homestay.delete(homestay_id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Homestay not found' });
    }
    res.status(200).json({ message: 'Homestay deleted successfully' });
  });
};
