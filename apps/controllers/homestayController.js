// controllers/homestayController.js
const homestayService = require('../services/homestayService');
const { uploadFile } = require('../services/googleStorageService'); // Service tải ảnh lên Google Cloud Storage
// Controller: Tạo mới homestay
const createHomestay = async (req, res) => {
  try {
    const { name, category, beds, rooms, max_guests, description, price, location, amenities } = req.body;

    // Tải từng file ảnh lên Google Cloud Storage và lấy URL
    const imageUrls = [];
    for (const file of req.files) {
      const destination = `homestay/${Date.now()}_${file.originalname}`; // Đường dẫn trong bucket
      const url = await uploadFile(file.buffer, destination); // Hàm upload sử dụng buffer
      imageUrls.push(url);
    }

    // Dữ liệu homestay để lưu vào database
    const homestayData = {
      host_id: req.user.user_id,
      name,
      description,
      location,
      price,
      images: imageUrls.join(','), // Ghép URL ảnh bằng dấu phẩy
      beds,
      rooms,
      max_guests,
      category_id: category
    };

    // Gọi service để tạo Homestay
    homestayService.createHomestay(homestayData, JSON.parse(amenities), (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(result);
    });
  } catch (error) {
    console.error('Error creating homestay:', error);
    res.status(500).json({ message: 'Failed to create homestay', error: error.message });
  }
};



// Controller: Lấy tất cả homestay
const getAllHomestays = async (req, res) => {
  try {
    const homestays = await homestayService.getAllHomestays();
    res.status(200).json(homestays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Lấy homestay theo ID
const getHomestayById = async (req, res) => {
  const { id } = req.params;

  try {
    const homestay = await homestayService.getHomestayById(id);
    if (homestay) {
      res.status(200).json(homestay); // Trả về dữ liệu homestay dưới dạng JSON
    } else {
      res.status(404).json({ message: 'Homestay not found' }); // Nếu không tìm thấy, trả về lỗi 404
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching homestay: ' + error.message }); // Lỗi server
  }
};
// Controller: Cập nhật homestay theo ID
const updateHomestay = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedHomestay = await homestayService.updateHomestay(id, updateData);
    res.status(200).json({
      message: 'Homestay updated successfully',
      homestay: updatedHomestay
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Xóa homestay theo ID
const deleteHomestay = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await homestayService.deleteHomestay(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * Controller: Lấy tất cả amenities
 * @param {Request} req - Yêu cầu từ client
 * @param {Response} res - Phản hồi từ server
 */
const getAllAmenities = async (req, res) => {
  try {
    const amenities = await homestayService.getAllAmenities();
    res.status(200).json(amenities); // Trả về danh sách amenities dưới dạng JSON
  } catch (error) {
    res.status(500).json({ message: error.message }); // Trả về lỗi nếu có
  }
};


const searchHomestay = async (req, res) => {
  const { location, priceMin, priceMax, guests, rooms } = req.query;

  // Lấy userId từ middleware hoặc null nếu chưa đăng nhập
  const userId = req.user?.user_id || null;
  console.log('User ID:', userId);

  const filters = {
    location,
    priceMin: priceMin ? parseFloat(priceMin) : undefined,
    priceMax: priceMax ? parseFloat(priceMax) : undefined,
    guests: guests ? parseInt(guests) : undefined,
    rooms: rooms ? parseInt(rooms) : undefined,
  };

  try {
    // Gửi filters và userId đến service
    const homestays = await homestayService.searchHomestay(filters, userId);

    // Kiểm tra và trả về kết quả
    if (homestays.length > 0) {
      return res.status(200).json(homestays);
    } else {
      return res.status(404).json({ message: 'No homestays found' });
    }
  } catch (error) {
    console.error('Error fetching homestays:', error.message);
    return res.status(500).json({ message: 'Error fetching homestays: ' + error.message });
  }
};







const getCategory = async (req, res) => {
  try {
    const categories = await homestayService.getCategory();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const getPendingHomestays = async (req, res) => {
  try {
    // Gọi service với `available = false`
    const pendingHomestays = await homestayService.getAllHomestays(false);
    res.status(200).json(pendingHomestays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getUnavailableHomestays = async (req, res) => {
  try {
    const homestays = await homestayService.getUnavailableHomestays();
    res.status(200).json(homestays); // Trả về danh sách homestay kèm hình ảnh
  } catch (error) {
    console.error('Error fetching unavailable homestays:', error.message);
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách homestay không khả dụng',
      error: error.message,
    });
  }
};


const approveHomestay = async (req, res) => {
  const { homestay_id } = req.body;

  if (!homestay_id) {
    return res.status(400).json({ success: false, message: 'Homestay ID không được cung cấp.' });
  }

  try {
    const result = await homestayService.approveHomestay(homestay_id);

    if (result) {
      res.status(200).json({ success: true, message: 'Homestay đã được phê duyệt.' });
    } else {
      res.status(404).json({ success: false, message: 'Homestay không tồn tại.' });
    }
  } catch (error) {
    console.error('Error approving homestay:', error.message);
    res.status(500).json({ success: false, message: 'Lỗi khi phê duyệt homestay.', error: error.message });
  }
};



const getHostHomestays = async (req, res) => {
  try {
    const hostId = req.user.user_id; // Lấy host_id từ token đã giải mã
    const homestays = await homestayService.getHostHomestays(hostId);

    if (homestays.length > 0) {
      res.status(200).json({
        success: true,
        homestays,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy homestay nào cho host này.',
      });
    }
  } catch (error) {
    console.error('Error fetching host homestays:', error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách homestay.',
      error: error.message,
    });
  }
};





const toggleWishlist = async (req, res) => {
  const { homestayId, isActive } = req.body;
  const userId = req.user.user_id; // Lấy user_id từ middleware `authenticateUser`

  if (!homestayId || typeof isActive === 'undefined') {
      return res.status(400).json({ message: 'Invalid data' });
  }

  try {
      if (isActive) {
          // Thêm vào wishlist
          await homestayService.addWishlist(userId, homestayId);
          res.status(200).json({ success: true, message: 'Added to wishlist' });
      } else {
          // Xoá khỏi wishlist
          await homestayService.removeWishlist(userId, homestayId);
          res.status(200).json({ success: true, message: 'Removed from wishlist' });
      }
  } catch (error) {
      res.status(500).json({ success: false, message: 'Error processing wishlist: ' + error.message });
  }
};


const getWishlistHomestays = async (req, res) => {
  try {
      const userId = req.user?.user_id;

      if (!userId) {
          return res.status(401).json({ success: false, message: 'Unauthorized: User not logged in' });
      }

      const wishlistHomestays = await homestayService.getWishlistHomestays(userId);

      return res.status(200).json({ success: true, wishlist: wishlistHomestays });
  } catch (error) {
      console.error('Error fetching wishlist homestays:', error.message);
      return res.status(500).json({ success: false, message: 'Error fetching wishlist homestays' });
  }
};





module.exports = { createHomestay, getAllHomestays, getHomestayById, 
  updateHomestay, deleteHomestay, searchHomestay, getAllAmenities,
  getCategory, getPendingHomestays, getUnavailableHomestays,
  approveHomestay, getHostHomestays, toggleWishlist,   getWishlistHomestays};
