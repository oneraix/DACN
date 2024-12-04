// apps/services/userService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Đăng ký người dùng mới
exports.registerUser = async (userData) => {
  try {
    const { username, email, password, full_name, phone, address } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    return User.createUser({ username, email, password: hashedPassword, full_name, phone, address });
  } catch (err) {
    throw new Error('Server error during registration');
  }
};

// Đăng nhập người dùng
// exports.loginUser = async (username, password) => {
//     try {
//       const user = await User.getUserByUsername(username);  // Lấy người dùng theo username
//       if (!user) {
//         throw new Error('User not found');
//       }
  
//       const isMatch = await bcrypt.compare(password, user.password);  // Kiểm tra mật khẩu
//       if (!isMatch) {
//         throw new Error('Invalid credentials');
//       }
  
//       const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       return { message: 'Login successful', token };
//     } catch (err) {
//       throw err;  
//     }
//   };

exports.loginUser = async (username, password) => {
    try {
      const user = await User.getUserByUsername(username);
      if (!user) {
        throw new Error('User not found');
      }
      const isMatch = await bcrypt.compare(password, user.password);  // Kiểm tra mật khẩu
      if (!isMatch) {
          console.log('Invalid credentials');
          throw new Error('Invalid credentials');  // Ném lỗi khi mật khẩu không khớp
      } 
      const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { message: 'Login successful', token };
    } catch (err) {
      console.error('Error in login:', err);
      throw err;
    }
  };

// Lấy tất cả người dùng
exports.getAllUsers = () => {
  return User.getAllUsers();
};
