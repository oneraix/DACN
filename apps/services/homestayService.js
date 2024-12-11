const HomestayModel = require('../models/homestayModel');
const Homestay = require('../models/homestayModel');

// Service: Tạo mới homestay
const createHomestay = async (data) => {
  try {
    const newHomestay = await Homestay.createHomestay(data); // Chỉnh lại tên phương thức ở đây
    return newHomestay;
  } catch (error) {
    throw new Error('Error creating homestay: ' + error.message);
  }
};

// Service: Lấy tất cả homestay
const getAllHomestays = async () => {
  try {
    const homestays = await Homestay.getAllHomestays(); // Chỉnh lại tên phương thức ở đây
    return homestays;
  } catch (error) {
    throw new Error('Error fetching homestays: ' + error.message);
  }
};

// Service: Lấy homestay theo ID
const getHomestayById = async (id) => {
  try {
    const homestay = await Homestay.getHomestayById(id); // Chỉnh lại tên phương thức ở đây
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


const searchHomestay = async (filters = {}) => {
  try {
    const homestays = await HomestayModel.searchHomestay(filters); // Gọi phương thức trong Model để lấy dữ liệu homestay
    return homestays;
  } catch (error) {
    throw new Error('Error fetching homestays: ' + error.message);
  }
};





module.exports = { createHomestay, getAllHomestays, getHomestayById, updateHomestay, deleteHomestay, searchHomestay, getAllAmenities };
