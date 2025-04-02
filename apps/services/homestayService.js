
const Homestay = require('../models/homestayModel');
const db = require('../config/database'); // Đường dẫn đúng đến file cấu hình database

// Service: Tạo mới homestay
const createHomestay = (homestayData, amenities, callback) => {
  Homestay.createHomestay(homestayData)
    .then((homestay) => {
      if (!Array.isArray(amenities) || amenities.length === 0) {
        return callback(null, { message: 'Homestay created successfully', homestay });
      }

      const amenityPromises = amenities.map((amenityId) =>
        Homestay.createHomestayAmenity(homestay.homestay_id, amenityId)
      );

      Promise.all(amenityPromises)
        .then(() => callback(null, { message: 'Homestay created successfully', homestay }))
        .catch(callback);
    })
    .catch(callback);
};

// Service: Lấy tất cả homestay
const getAllHomestays = async (available = null) => {
  try {
    const homestays = await Homestay.getAllHomestays(available);
    return homestays;
  } catch (error) {
    throw new Error('Error fetching homestays: ' + error.message);
  }
};
// Service: Lấy homestay theo ID
const getHomestayById = async (id) => {
  try {
    const homestay = await Homestay.getHomestayById(id);
    if (homestay) {
      // Phân tích amenities thành một mảng nếu không rỗng
      homestay.amenities = homestay.amenities ? homestay.amenities.split(',') : [];
    }
    return homestay;
  } catch (error) {
    throw new Error('Error fetching homestay: ' + error.message);
  }
};

// Service: Cập nhật homestay theo ID
const updateHomestay = async (id, data) => {
  try {
    const updatedHomestay = await Homestay.updateHomestay(id, data); // Chỉnh lại tên phương thức ở đây
    return updatedHomestay;
  } catch (error) {
    throw new Error('Error updating homestay: ' + error.message);
  }
};

// Service: Xóa homestay theo ID
const deleteHomestay = async (id) => {
  try {
    const response = await Homestay.deleteHomestay(id); // Chỉnh lại tên phương thức ở đây
    return response;
  } catch (error) {
    throw new Error('Error deleting homestay: ' + error.message);
  }
};



/**
 * Lấy tất cả amenities
 * @returns {Promise<Array>} - Mảng tất cả amenities
 */
const getAllAmenities = async () => {
  try {
    const amenities = await Homestay.getAllAmenities();
    return amenities; // Trả về danh sách amenities
  } catch (error) {
    throw new Error('Error fetching amenities: ' + error.message);
  }
};


// const searchHomestay = async (filters = {}) => {
//   try {
//     const homestays = await Homestay.searchHomestay(filters); // Gọi phương thức trong Model để lấy dữ liệu homestay
//     return homestays;
//   } catch (error) {
//     throw new Error('Error fetching homestays: ' + error.message);
//   }
// };
const searchHomestay = async (filters, userId) => {
  try {
    // Gọi model để lấy dữ liệu
    const homestays = await Homestay.searchHomestay(filters, userId);

    // Trả về kết quả sau khi truy vấn
    return homestays;
  } catch (error) {
    console.error('Error fetching homestays:', error.message);
    throw new Error('Error fetching homestays: ' + error.message);
  }
};





const getCategory = async () => {
  try {
    const categories = await Homestay.getCategory();
    return categories;
  } catch (error) {
    throw new Error('Error fetching categories: ' + error.message);
  }
};


const getUnavailableHomestays = async () => {
  try {
    const homestays = await Homestay.getUnavailableHomestays();
    return homestays;
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách homestay không khả dụng: ' + error.message);
  }
};


const approveHomestay = async (id) => {
  console.log('Updating availability for homestay ID:', id);
  try {
    const updated = await Homestay.updateAvailability(id, true);
    console.log('Update result:', updated);
    return updated.affectedRows > 0; // Trả về true nếu cập nhật thành công
  } catch (error) {
    throw new Error('Lỗi khi cập nhật trạng thái homestay: ' + error.message);
  }
};



const getHostHomestays = async (hostId) => {
  try {
    return await Homestay.getHomestaysByHostId(hostId);
  } catch (error) {
    throw new Error('Lỗi khi lấy danh sách homestay của host: ' + error.message);
  }
};




const addWishlist = async (userId, homestayId) => {
  try {
      await Homestay.addWishlist(userId, homestayId);
  } catch (error) {
      throw new Error('Error adding to wishlist: ' + error.message);
  }
};

const removeWishlist = async (userId, homestayId) => {
  try {
      await Homestay.removeWishlist(userId, homestayId);
  } catch (error) {
      throw new Error('Error removing from wishlist: ' + error.message);
  }
};




const getWishlistHomestays = async (userId) => {
  try {
      const wishlistHomestays = await Homestay.getWishlistHomestays(userId);
      return wishlistHomestays;
  } catch (error) {
      throw new Error('Error fetching wishlist homestays: ' + error.message);
  }
};



const addCategory = async (category_name) => {
  try {
    const newCategory = await Homestay.addCategory(category_name);
    return newCategory;
  } catch (error) {
    throw new Error('Error adding category: ' + error.message);
  }
};

const updateCategory = async (id, category_name) => {
  try {
    const updatedCategory = await Homestay.updateCategory(id, category_name);
    return updatedCategory;
  } catch (error) {
    throw new Error('Error updating category: ' + error.message);
  }
};

const deleteCategory = async (id) => {
  try {
    const result = await Homestay.deleteCategory(id);
    return result;
  } catch (error) {
    throw new Error('Error deleting category: ' + error.message);
  }
};


module.exports = { createHomestay, getAllHomestays, getHomestayById, 
  updateHomestay, deleteHomestay, searchHomestay, getAllAmenities ,getCategory,
  getUnavailableHomestays,approveHomestay, getHostHomestays, addWishlist, removeWishlist,
  getWishlistHomestays, addCategory, updateCategory, deleteCategory
};
