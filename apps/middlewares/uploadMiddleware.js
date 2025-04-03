const multer = require('multer');

// Cấu hình multer sử dụng bộ nhớ tạm
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Giới hạn 2MB mỗi file
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, .png files are allowed!'));
    }
  }
});

module.exports = upload;
