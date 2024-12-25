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


const getPendingBookingsByHostId = async (host_id) => {
  try {
    const bookings = await Booking.getPendingBookingsByHostId(host_id);
    return bookings;
  } catch (error) {
    throw new Error('Error fetching pending bookings: ' + error.message);  // Ném lại lỗi cho controller
  }
};


const updateBookingStatus = async (id, status) => {
  try {
    // Gọi phương thức Model để cập nhật trạng thái booking
    const updatedBooking = await Booking.updateBookingStatus(id, status);
    
    // Trả về kết quả nếu cập nhật thành công
    return updatedBooking;
  } catch (error) {
    // Ném lỗi nếu có sự cố xảy ra trong quá trình cập nhật
    throw new Error('Error updating booking status: ' + error.message);
  }
};

const getPendingBookingsByUserId = async (user_id) => {
  try {
    // Gọi model để lấy dữ liệu từ database
    const bookings = await Booking.getPendingBookingsByUserId(user_id);
    return bookings;  // Trả về danh sách booking
  } catch (error) {
    throw new Error('Error fetching pending bookings: ' + error.message);  // Ném lỗi nếu có vấn đề
  }
};

const getBookingWaitingPayment = async (user_id) => {
  try {
      // Gọi model để lấy danh sách booking
      const bookings = await Booking.getBookingWaitingPayment(user_id);
      return bookings;
  } catch (error) {
      throw new Error("Error fetching bookings: " + error.message);
  }
};


const getAllBookingsForAdmin = async () => {
  try {
      // Lấy tất cả bookings từ database
      const bookings = await Booking.getAllBookingsForAdmin();
      return bookings;
  } catch (error) {
      throw new Error('Error in service layer: ' + error.message);
  }
};


const getBookedDatesByHomestayId = async (homestayId) => {
  try {
    const bookedDates = await Booking.getBookedDatesByHomestayId(homestayId);
    return bookedDates;
  } catch (error) {
    throw new Error('Error fetching booked dates: ' + error.message);
  }
};


module.exports = { createBooking, getAllBookings, getBookingById, 
  updateBooking, deleteBooking, calculateTotalAmount, getBookingsByUserId, 
  getPendingBookingsByHostId, updateBookingStatus,getPendingBookingsByUserId,
  getBookingWaitingPayment, getAllBookingsForAdmin, getBookedDatesByHomestayId };
