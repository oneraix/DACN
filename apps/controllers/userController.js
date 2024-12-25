// apps/controllers/userController.js
const userService = require('../services/userService');
const { uploadFile } = require('../services/googleStorageService');

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

exports.getUserInformationById = async (req, res) => {
  const { user_id } = req.user; // Lấy user_id từ req.user
  try {
    const userInfo = await userService.getUserInformationById(user_id); // Gọi hàm trong service
    res.json(userInfo); // Trả về thông tin người dùng bao gồm profile_picture, full_name và role
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getUsersList = async (req, res) => {
  try {
    // Gọi service để lấy danh sách người dùng
    const users = await userService.getAllUsers();
    
    // Chọn các trường cần thiết
    const usersList = users.map(user => ({
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      email: user.email,
      status: user.status,
      full_name: user.full_name,
      address: user.address,
      profile_picture: user.profile_picture || null,  // Nếu không có profile picture, trả về null
    }));

    res.json(usersList);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};




exports.getWishlistHomestays = async (req, res) => {
  try {
    // Lấy user_id từ middleware
    const user_id = req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not logged in' });
    }

    // Gọi service để lấy danh sách homestays trong wishlist
    const wishlistHomestays = await userService.getWishlistHomestays(user_id);

    if (!Array.isArray(wishlistHomestays)) {
      return res.status(500).json({ success: false, message: 'Unexpected data format from service' });
    }

    // Chuẩn hóa dữ liệu trả về
    const homestayList = wishlistHomestays.map(homestay => ({
      homestay_id: homestay.homestay_id,
      name: homestay.name,
      location: homestay.location,
      price: homestay.price,
      max_guests: homestay.max_guests,
      beds: homestay.beds,
      rooms: homestay.rooms,
      available: homestay.available,
      image: homestay.image || null, // Trả về null nếu không có ảnh
      review_count: homestay.review_count || 0,
      average_rating: homestay.average_rating || 0,
    }));

    return res.status(200).json({ success: true, wishlist: homestayList });
  } catch (error) {
    console.error('Error fetching wishlist homestays:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching wishlist homestays: ' + error.message });
  }
};

// Cập nhật thông tin người dùng
exports.updateUserInfo = async (req, res) => {
  const { id } = req.params;  // Lấy user_id từ params
  const updatedData = req.body;  // Lấy dữ liệu cập nhật từ body

  try {
    // Gọi service để cập nhật thông tin người dùng
    const updatedUser = await userService.updateUserInfo(id, updatedData);
    
    res.json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    console.error('Controller error:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};




exports.getProfile = async (req, res) => {
  try {
      // Lấy thông tin từ token đã xác thực
      const { user_id } = req.user;
      // Gọi service để lấy thông tin người dùng
      const profile = await userService.getProfile(user_id);

      res.json({
          success: true,
          data: {
              full_name: profile.full_name,
              phone: profile.phone,
              email: profile.email,
              address: profile.address,
              profile_picture: profile.profile_picture || '/global/assets/images/avata/default.png',
          },
      });
  } catch (error) {
      console.error('Error fetching profile:', error.message);
      res.status(500).json({
          success: false,
          message: 'Failed to fetch profile',
          error: error.message,
      });
  }
};




exports.updateProfile = async (req, res) => {
  try {
    const { user_id } = req.user; // Lấy user_id từ token
    const { full_name, phone, email, address } = req.body;

    let profile_picture = null;

    // Kiểm tra và upload avatar nếu có file
    if (req.file) {
      const destination = `avatars/${user_id}_${Date.now()}_${req.file.originalname}`;
      profile_picture = await uploadFile(req.file.buffer, destination);
    }

    // Gọi service để cập nhật thông tin người dùng (không có mật khẩu)
    const updatedUser = await userService.updateUserProfile(user_id, {
      full_name,
      phone,
      email,
      address,
      profile_picture,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};



exports.changePassword = async (req, res) => {
  const { user_id } = req.user;
  const { old_password, new_password } = req.body;

  try {
    const result = await userService.changeUserPassword(user_id, old_password, new_password);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error('Error changing password:', error.message);
    res.status(500).json({
      success: false,
      message: 'Thay đổi mật khẩu thất bại',
      error: error.message || 'Có lỗi xảy ra khi thay đổi mật khẩu.',
    });
  }
};
