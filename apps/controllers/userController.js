// apps/controllers/userController.js
const userService = require('../services/userService');

// // Đăng ký người dùng mới
// exports.registerUser = async (req, res) => {
//   try {
//     const userData = req.body;
//     const user = await userService.registerUser(userData);
//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // Đăng nhập người dùng
// exports.loginUser = async (req, res) => {
//   try {
//     const { usernameOrEmail, password } = req.body;
//     const response = await userService.loginUser({ usernameOrEmail, password });
//     res.json(response);
//   } catch (err) {
//     res.status(400).json({ message: 'Login failed', error: err.message });
//   }
// };

// Lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

exports.getUserImageById = async (req, res) => {
  const { id } = req.params; // Lấy user_id từ params

  try {
    const profileImage = await userService.getUserImageById(id); // Gọi hàm trong service
    if (!profileImage) {
      return res.status(404).json({ message: 'User not found or no profile picture' });
    }
    res.json({ profile_picture: profileImage }); // Trả về ảnh profile
  } catch (error) {
    console.error('Controller error:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};