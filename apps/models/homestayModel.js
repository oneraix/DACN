const db = require('../config/database');

// Tạo homestay mới
exports.create = (host_id, name, description, location, price, amenities, images, callback) => {
  const query = 'INSERT INTO Homestays (host_id, name, description, location, price, amenities, images, available) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)';
  db.query(query, [host_id, name, description, location, price, amenities, images], callback);
};

// Lấy homestay theo ID
exports.getById = (homestay_id, callback) => {
  const query = 'SELECT * FROM Homestays WHERE homestay_id = ?';
  db.query(query, [homestay_id], callback);
};

// Lấy homestay theo Host ID
exports.getByHostId = (host_id, callback) => {
  const query = 'SELECT * FROM Homestays WHERE host_id = ?';
  db.query(query, [host_id], callback);
};

// Cập nhật homestay
exports.update = (homestay_id, name, description, location, price, amenities, images, available, callback) => {
  const query = 'UPDATE Homestays SET name = ?, description = ?, location = ?, price = ?, amenities = ?, images = ?, available = ? WHERE homestay_id = ?';
  db.query(query, [name, description, location, price, amenities, images, available, homestay_id], callback);
};

// Xóa homestay
exports.delete = (homestay_id, callback) => {
  const query = 'DELETE FROM Homestays WHERE homestay_id = ?';
  db.query(query, [homestay_id], callback);
};

// Lấy tất cả homestays
exports.getAll = (callback) => {
  const query = 'SELECT * FROM Homestays';
  db.query(query, callback);
};
