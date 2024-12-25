// apps/services/userService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const googleStorageService = require('../services/googleStorageService');

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
// exports.getAllUsers = () => {
//   return userModel.getAllUsers();
// };

exports.getUserInformationById = async (user_id) => {
  try {
    const userInfo = await userModel.getUserInformationById(user_id); // Gọi hàm từ model
    if (!userInfo || !userInfo.profile_picture) {
      userInfo.profile_picture = '/global/assets/images/avata/default.png'; // Sử dụng ảnh mặc định nếu không có ảnh
    }
    return userInfo; // Trả về thông tin người dùng bao gồm profile_picture, full_name và role
  } catch (error) {
    console.error('Service error:', error.message);
    throw error;
  }
};


exports.getAllUsers = async () => {
  try {
    const users = await userModel.getAllUsers();  // Lấy tất cả người dùng từ model
    return users;  // Trả về danh sách người dùng
  } catch (err) {
    console.error('Error in getAllUsers service:', err);
    throw new Error('Server error');
  }
};


// Cập nhật thông tin người dùng
exports.updateUserInfo = async (user_id, updatedData) => {
  try {
    // Gọi model để cập nhật thông tin người dùng
    const result = await userModel.updateUserProfile(user_id, updatedData);
    if (result.affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }
    return updatedData;  // Trả về dữ liệu đã cập nhật
  } catch (err) {
    console.error('Error in updateUserProfile service:', err);
    throw new Error('Server error');
  }
};



exports.getProfile = async (user_id) => {
  try {
      const profile = await userModel.getProfileById(user_id);
      if (!profile) {
          throw new Error('User not found');
      }
      return profile;
  } catch (error) {
      console.error('Service error in getProfile:', error.message);
      throw error;
  }
};





exports.updateUserProfile = async (user_id, updatedData) => {
  const { full_name, phone, email, address, profile_picture } = updatedData;

  // Lấy thông tin hiện tại của người dùng
  const user = await userModel.getProfileById(user_id);
  if (!user) {
    throw new Error('User not found');
  }

  // Loại bỏ các trường không cần cập nhật
  const updateFields = {
    full_name: full_name || user.full_name,
    phone: phone || user.phone,
    email: email || user.email,
    address: address || user.address,
    profile_picture: profile_picture || user.profile_picture,
  };

  // Gọi model để cập nhật thông tin
  await userModel.updateUserProfile(user_id, updateFields);

  // Lấy thông tin mới nhất sau khi cập nhật
  const updatedUser = await userModel.getProfileById(user_id);
  return updatedUser;
};


exports.changeUserPassword = async (user_id, old_password, new_password) => {
  try {
    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const user = await userModel.getProfileById(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      throw new Error('Old password is incorrect');
    }

    // Kiểm tra mật khẩu mới và mật khẩu cũ có khác nhau không
    const isNewPasswordSame = await bcrypt.compare(new_password, user.password);
    if (isNewPasswordSame) {
      return { success: false, message: 'New password cannot be the same as old password' };
    }

    // Mã hóa mật khẩu mới và cập nhật vào cơ sở dữ liệu
    const result = await userModel.updateUserPassword(user_id, new_password);

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error changing password:', error.message);
    throw error;
  }
};





exports.getWishlistHomestays = async (user_id) => {
  try {
    // Gọi model để lấy danh sách homestays từ wishlist
    const wishlistHomestays = await userModel.getWishlistHomestays(user_id);

    if (!Array.isArray(wishlistHomestays)) {
      throw new Error('Unexpected result format from model');
    }

    return wishlistHomestays;
  } catch (error) {
    console.error('Error fetching wishlist homestays from service:', error.message);
    throw error;
  }
};