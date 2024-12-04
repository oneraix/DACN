// apps/models/paymentModel.js
const db = require('../config/database'); // Kết nối với cơ sở dữ liệu
const Payment = require('./paymentEntity'); // Sử dụng entity Payment

class PaymentModel {
  // Thêm thanh toán mới
  static createPayment(paymentData) {
    const { booking_id, payment_method, amount, transaction_id } = paymentData;

    const query = `INSERT INTO Payments (booking_id, payment_method, amount, payment_status, transaction_id)
                   VALUES (?, ?, ?, 'pending', ?)`;

    const values = [booking_id, payment_method, amount, transaction_id];
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        const newPayment = new Payment(result.insertId, booking_id, payment_method, amount, transaction_id);
        resolve(newPayment);
      });
    });
  }

  // Lấy thông tin thanh toán theo ID
  static getPaymentById(payment_id) {
    const query = 'SELECT * FROM Payments WHERE payment_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [payment_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result[0]);
      });
    });
  }

  // Cập nhật trạng thái thanh toán
  static updatePaymentStatus(payment_id, payment_status) {
    const query = 'UPDATE Payments SET payment_status = ? WHERE payment_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [payment_status, payment_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = PaymentModel;
