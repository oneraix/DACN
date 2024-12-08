// controllers/homestayController.js
const homestayService = require('../services/homestayService');

// Controller: Tạo mới homestay
const createHomestay = async (req, res) => {
  const { host_id, name, description, location, price, amenities, images, available, beds, rooms, max_guests } = req.body;

  try {
    const newHomestay = await homestayService.createHomestay({
      host_id,
      name,
      description,
      location,
      price,
      amenities,
      images,
      available,
      beds,
      rooms,
      max_guests
    });
    res.status(201).json({
      message: 'Homestay created successfully',
      homestay: newHomestay
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const homestay = await homestayService.getHomestayById(id); // Gọi phương thức trong service để lấy dữ liệu
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

// Controller: Tìm kiếm homestay
/**
 * Controller: Tìm kiếm homestay
 * @param {Request} req - Yêu cầu từ client, chứa các điều kiện trong query params
 * @param {Response} res - Phản hồi từ server
 */
const searchHomestay = async (req, res) => {
  const filters = req.query; // Lấy điều kiện tìm kiếm từ query params

  try {
    const homestays = await homestayService.searchHomestay(filters); // Gọi service để tìm kiếm
    res.status(200).json(homestays); // Trả về danh sách homestay tìm được
  } catch (error) {
    res.status(500).json({ message: 'Error searching homestays: ' + error.message });
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
module.exports = { createHomestay, getAllHomestays, getHomestayById, updateHomestay, deleteHomestay, searchHomestay, getAllAmenities };
