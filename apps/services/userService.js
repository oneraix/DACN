// apps/services/userService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

//Đăng kí
exports.register = async (userData) => {
  const { username, email, password, full_name } = userData;
  const existingUser = await userModel.getUserByUsernameOrEmail(username);  // Kiểm tra xem email hoặc username đã tồn tại trong DB chưa
  if (existingUser) {
      throw new Error('Username or email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);  // Mã hóa mật khẩu
  const newUser = await userModel.createUser({username,email,password: hashedPassword,full_name});  // Tạo người dùng mới trong cơ sở dữ liệu

  return {
      message: 'User registered successfully',
      user: {
          user_id: newUser.user_id,
          username: newUser.username,
          email: newUser.email,
          full_name: newUser.full_name
      }
  };
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
//Đăng nhập
exports.login = async (usernameOrEmail, password) => {
  try {
      const user = await userModel.getUserByUsernameOrEmail(usernameOrEmail); // Tìm người dùng theo username hoặc email
      if (!user) {
          return null;  // Trả về null nếu không tìm thấy người dùng
      }
      const isMatch = await bcrypt.compare(password, user.password);   // Kiểm tra mật khẩu
      if (!isMatch) {
          return null;  // Trả về null nếu mật khẩu không đúng
      }
      const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });      // Tạo token JWT và trả về thông tin đăng nhập

      return {
        user_id: user.user_id,
        username: user.username,
        role: user.role
      };

  } catch (err) {
      console.error('Error in userService.login:', err);
      throw new Error('Server error');
  }
};

exports.verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

// Lấy tất cả người dùng
exports.getAllUsers = () => {
  return userModel.getAllUsers();
};
