const db = require('../config/database');

// Thêm bản ghi thanh toán vào bảng payments
const createPayment = async (bookingId, amount, transactionNo, responseCode) => {
  const query = `
    INSERT INTO payments (booking_id, amount, transaction_no, response_code, payment_status)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  return new Promise((resolve, reject) => {
    db.query(query, [bookingId, amount, transactionNo, responseCode, 'success'], (err, result) => {
      if (err) {
        console.error("Error inserting payment record:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Cập nhật trạng thái thanh toán trong bảng bookings
const updateBookingPaymentStatus = async (bookingId, status) => {
  const query = `
    UPDATE bookings
    SET payment_status = ?
    WHERE booking_id = ?
  `;
  
  return new Promise((resolve, reject) => {
    db.query(query, [status, bookingId], (err, result) => {
      if (err) {
        console.error("Error updating booking status:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = {
  createPayment,
  updateBookingPaymentStatus
};
