const bookingService = require('../services/bookingService');

// Controller: Tạo mới booking
const createBooking = async (req, res) => {
    const { user_id, homestay_id, check_in, check_out, adults_count, children_count, status } = req.body;
  
    try {
      // Kiểm tra ngày check_in phải nhỏ hơn ngày check_out
      const checkInDate = new Date(check_in);
      const checkOutDate = new Date(check_out);
  
      if (checkInDate >= checkOutDate) {
        return res.status(400).json({ message: 'Check-in date must be earlier than check-out date' });
      }
  
      // Gọi service để tạo booking
      const newBooking = await bookingService.createBooking({
        user_id,
        homestay_id,
        check_in,
        check_out,
        adults_count,
        children_count,
        status
      });
  
      // Trả về kết quả
      res.status(201).json({
        message: 'Booking created successfully',
        booking: newBooking
      });
    } catch (error) {
      res.status(500).json({ message: error.message }); // Xử lý lỗi server
    }
};

// Controller: Lấy tất cả bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Lấy booking theo ID
const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await bookingService.getBookingById(id);
    if (booking) {
      res.status(200).json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Cập nhật booking theo ID
const updateBooking = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedBooking = await bookingService.updateBooking(id, updateData);
    res.status(200).json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Xóa booking theo ID
const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await bookingService.deleteBooking(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Tính tổng giá tiền cho booking
const calculateTotalAmount = async (req, res) => {
  const { homestay_id, check_in, check_out } = req.body;

  try {
    const totalAmount = await bookingService.calculateTotalAmount(homestay_id, check_in, check_out);
    res.status(200).json({ total_amount: totalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller: Lấy danh sách booking của người dùng
const getBookingsByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const bookings = await bookingService.getBookingsByUserId(user_id);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking, calculateTotalAmount, getBookingsByUserId };
