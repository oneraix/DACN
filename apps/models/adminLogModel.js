// apps/models/adminLogModel.js
const db = require('../config/database'); // Kết nối với cơ sở dữ liệu
const AdminLog = require('../entity/adminLogEntity'); // Sử dụng entity AdminLog

class AdminLogModel {
  // Thêm log hành động của quản trị viên
  static createAdminLog(logData) {
    const { admin_id, action_type, action_details } = logData;

    const query = `INSERT INTO AdminLogs (admin_id, action_type, action_details)
                   VALUES (?, ?, ?)`;

    const values = [admin_id, action_type, action_details];
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        const newAdminLog = new AdminLog(result.insertId, admin_id, action_type, action_details);
        resolve(newAdminLog);
      });
    });
  }

  // Lấy thông tin log theo ID
  static getAdminLogById(log_id) {
    const query = 'SELECT * FROM AdminLogs WHERE log_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [log_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result[0]);
      });
    });
  }

  // Lấy tất cả logs của quản trị viên
  static getAdminLogsByAdminId(admin_id) {
    const query = 'SELECT * FROM AdminLogs WHERE admin_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [admin_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = AdminLogModel;
