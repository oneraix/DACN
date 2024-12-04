// apps/controllers/userController.js
const userService = require('../services/userService');

// Đăng ký người dùng mới
exports.registerUser = async (req, res) => {
  try {
    const userData = req.body;
    await userService.registerUser(userData);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Đăng nhập người dùng
exports.loginUser = async (req, res) => {
  try {
    const { username, password} = req.body;
    const response = await userService.loginUser(username, password);
    res.json(response);  // Trả về token khi đăng nhập thành công
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};
