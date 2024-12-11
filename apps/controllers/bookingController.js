const bookingService = require('../services/bookingService');

// Controller: Tạo mới booking
const createBooking = async (req, res) => {
  const { homestay_id, check_in, check_out, adults_count, children_count } = req.body;
  const { user_id } = req.user; // Lấy user_id từ middleware (đã được xác thực trong token)

  try {
    // Kiểm tra ngày check_in phải nhỏ hơn ngày check_out
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-in date must be earlier than check-out date' });
    }

    // Tạo đối tượng booking với giá trị mặc định cho status (ví dụ: 'pending')
    const bookingData = {
      user_id,
      homestay_id,
      check_in,
      check_out,
      adults_count,
      children_count,
    };

    // Gọi service để tạo booking
    const newBooking = await bookingService.createBooking(bookingData);

    // Trả về kết quả
    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message }); // Xử lý lỗi server
  }
};

// Lấy tất cả bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy booking theo ID
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

// Cập nhật booking theo ID
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

//  Xóa booking theo ID
const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await bookingService.deleteBooking(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tính tổng giá tiền cho booking
const calculateTotalAmount = async (req, res) => {
  const { homestay_id, check_in, check_out } = req.body;

  try {
    const totalAmount = await bookingService.calculateTotalAmount(homestay_id, check_in, check_out);
    res.status(200).json({ total_amount: totalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// lấy các booking pending của host
const getPendingBookingsByHostId = async (req, res) => {
  const { user_id } = req.user;  

  try {
    const bookings = await bookingService.getPendingBookingsByHostId(user_id);
    res.status(200).json(bookings);  // Trả về danh sách booking pending
  } catch (error) {
    res.status(500).json({ message: error.message });  // Trả lỗi nếu có vấn đề xảy ra
  }
};

const updateBookingStatus = async (req, res) => {
  const { id } = req.params; // Lấy id booking từ params
  const { status } = req.body; // Lấy status từ body (confirmed, cancelled)

  try {
    // Gọi service để cập nhật trạng thái booking
    const updatedBooking = await bookingService.updateBookingStatus(id, status);
    
    if (updatedBooking) {
      res.status(200).json({
        message: 'Booking status updated successfully',
        booking: updatedBooking
      });
    } else {
      res.status(404).json({ message: 'Booking not found or status not updated' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error updating booking status: ' + error.message
    });
  }
};

const getPendingBookingsByUserId = async (req, res) => {
  const { user_id } = req.user;  // Lấy user_id từ middleware xác thực (token)

  try {
    // Gọi service để lấy danh sách booking chờ xác nhận
    const bookings = await bookingService.getPendingBookingsByUserId(user_id);
    res.status(200).json(bookings);  // Trả về danh sách booking
  } catch (error) {
    res.status(500).json({ message: error.message });  // Trả lỗi nếu có vấn đề xảy ra
  }
};



module.exports = { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking, calculateTotalAmount, 
 getPendingBookingsByHostId, updateBookingStatus, getPendingBookingsByUserId };
