// apps/models/bookingModel.js
const db = require('../config/database'); // Kết nối với cơ sở dữ liệu
const Booking = require('../entity/bookingEntity'); // Sử dụng entity Booking

class BookingModel {
  // Thêm đặt phòng mới
  static createBooking(bookingData) {
    const { guest_id, homestay_id, check_in, check_out, total_amount } = bookingData;

    const query = `INSERT INTO Bookings (guest_id, homestay_id, check_in, check_out, total_amount, status, payment_status)
                   VALUES (?, ?, ?, ?, ?, 'pending', 'pending')`;

    const values = [guest_id, homestay_id, check_in, check_out, total_amount];
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        const newBooking = new Booking(result.insertId, guest_id, homestay_id, check_in, check_out, total_amount);
        resolve(newBooking);
      });
    });
  }

  // Lấy thông tin đặt phòng theo ID
  static getBookingById(booking_id) {
    const query = 'SELECT * FROM Bookings WHERE booking_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [booking_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result[0]);
      });
    });
  }

  // Cập nhật trạng thái đặt phòng
  static updateBookingStatus(booking_id, status) {
    const query = 'UPDATE Bookings SET status = ? WHERE booking_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [status, booking_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = BookingModel;
