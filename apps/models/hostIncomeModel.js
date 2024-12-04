// apps/models/hostIncomeModel.js
const db = require('../config/database'); // Kết nối với cơ sở dữ liệu
const HostIncome = require('../entity/hostIncomeEntity'); // Sử dụng entity HostIncome

class HostIncomeModel {
  // Thêm thu nhập của chủ nhà
  static createHostIncome(incomeData) {
    const { host_id, total_income, income_date } = incomeData;

    const query = `INSERT INTO HostIncome (host_id, total_income, income_date)
                   VALUES (?, ?, ?)`;

    const values = [host_id, total_income, income_date];
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        const newHostIncome = new HostIncome(result.insertId, host_id, total_income, income_date);
        resolve(newHostIncome);
      });
    });
  }

  // Lấy thông tin thu nhập theo ID
  static getHostIncomeById(income_id) {
    const query = 'SELECT * FROM HostIncome WHERE income_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [income_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result[0]);
      });
    });
  }

  // Lấy tất cả thu nhập của chủ nhà theo host_id
  static getHostIncomeByHostId(host_id) {
    const query = 'SELECT * FROM HostIncome WHERE host_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [host_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  // Cập nhật thu nhập của chủ nhà
  static updateHostIncome(income_id, total_income) {
    const query = 'UPDATE HostIncome SET total_income = ? WHERE income_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [total_income, income_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = HostIncomeModel;
