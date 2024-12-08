const Booking = require('../models/bookingModel');

// Service: Tạo mới booking
const createBooking = async (data) => {
    const { check_in, check_out } = data;
  
    // Kiểm tra ngày check_in phải nhỏ hơn ngày check_out
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
  
    if (checkInDate >= checkOutDate) {
      throw new Error('Check-in date must be earlier than check-out date');
    }
  
    try {
      // Gọi hàm createBooking trong model để tạo booking
      const newBooking = await Booking.createBooking(data);
      return newBooking; // Trả về booking mới được tạo
    } catch (error) {
      throw new Error('Error creating booking: ' + error.message); // Xử lý lỗi nếu có
    }
  };

  
// Service: Lấy tất cả bookings
const getAllBookings = async () => {
  try {
    const bookings = await Booking.getAllBookings();
    return bookings;
  } catch (error) {
    throw new Error('Error fetching bookings: ' + error.message);
  }
};

// Service: Lấy booking theo ID
const getBookingById = async (id) => {
  try {
    const booking = await Booking.getBookingById(id);
    return booking;
  } catch (error) {
    throw new Error('Error fetching booking: ' + error.message);
  }
};

// Service: Cập nhật booking theo ID
const updateBooking = async (id, data) => {
  try {
    const updatedBooking = await Booking.updateBooking(id, data);
    return updatedBooking;
  } catch (error) {
    throw new Error('Error updating booking: ' + error.message);
  }
};

// Service: Xóa booking theo ID
const deleteBooking = async (id) => {
  try {
    const result = await Booking.deleteBooking(id);
    return result;
  } catch (error) {
    throw new Error('Error deleting booking: ' + error.message);
  }
};

// Service: Tính tổng tiền booking
const calculateTotalAmount = async (homestay_id, check_in, check_out) => {
  try {
    const totalAmount = await Booking.calculateTotalAmount(homestay_id, check_in, check_out);
    return totalAmount;
  } catch (error) {
    throw new Error('Error calculating total amount: ' + error.message);
  }
};

// Service: Lấy tất cả bookings của một người dùng
const getBookingsByUserId = async (user_id) => {
  try {
    const bookings = await Booking.getBookingsByUserId(user_id);
    return bookings;
  } catch (error) {
    throw new Error('Error fetching bookings: ' + error.message);
  }
};

module.exports = { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking, calculateTotalAmount, getBookingsByUserId };
