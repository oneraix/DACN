// apps/services/userService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');


//Đăng kí
exports.register = async (userData) => {
  const { username, email, password, full_name } = userData;
  const existingUser = await userModel.getUserByUsernameOrEmail(username);    // Kiểm tra xem email hoặc username đã tồn tại trong DB chưa
  if (existingUser) {
      throw new Error('Username or email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);  // Mã hóa mật khẩu

  const newUser = await userModel.createUser({  // Tạo người dùng mới trong cơ sở dữ liệu
      username,
      email,
      password: hashedPassword,
      full_name
  });

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

// Kiểm tra xem email hoặc username đã tồn tại trong DB chưa
exports.checkUserExistence = async (username, email) => {
    const user = await userModel.getUserByUsernameOrEmail(username);  // Kiểm tra người dùng theo username
    if (user) {
        return user;  // Nếu tìm thấy người dùng, trả về thông tin người dùng
    }
    
    const userByEmail = await userModel.getUserByUsernameOrEmail(email);  // Kiểm tra người dùng theo email
    if (userByEmail) {
        return userByEmail;  // Nếu tìm thấy người dùng qua email, trả về thông tin
    }

    return null;  // Nếu không tìm thấy người dùng nào
};


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

exports.getUserImageById = async (user_id) => {
  try {
    const userImage = await userModel.getUserImageById(user_id); // Gọi hàm từ model
    if (!userImage || !userImage.profile_picture) {
      throw new Error('No profile picture found for this user'); // Trường hợp không có ảnh
    }
    return userImage.profile_picture; // Trả về ảnh profile
  } catch (error) {
    console.error('Service error:', error.message);
    throw error;
  }
};