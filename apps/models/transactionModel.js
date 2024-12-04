// apps/models/transactionModel.js
const db = require('../config/database'); // Kết nối với cơ sở dữ liệu
const Transaction = require('../entity/transactionEntity'); // Sử dụng entity Transaction

class TransactionModel {
  // Thêm giao dịch mới
  static createTransaction(transactionData) {
    const { booking_id, transaction_type, amount, transaction_status } = transactionData;

    const query = `INSERT INTO Transactions (booking_id, transaction_type, amount, transaction_status)
                   VALUES (?, ?, ?, ?)`;

    const values = [booking_id, transaction_type, amount, transaction_status];
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        const newTransaction = new Transaction(result.insertId, booking_id, transaction_type, amount, transaction_status);
        resolve(newTransaction);
      });
    });
  }

  // Lấy thông tin giao dịch theo ID
  static getTransactionById(transaction_id) {
    const query = 'SELECT * FROM Transactions WHERE transaction_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [transaction_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result[0]);
      });
    });
  }

  // Lấy tất cả giao dịch theo booking_id
  static getTransactionsByBookingId(booking_id) {
    const query = 'SELECT * FROM Transactions WHERE booking_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [booking_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  // Cập nhật trạng thái giao dịch
  static updateTransactionStatus(transaction_id, transaction_status) {
    const query = 'UPDATE Transactions SET transaction_status = ? WHERE transaction_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [transaction_status, transaction_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = TransactionModel;
