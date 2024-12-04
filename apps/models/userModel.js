// apps/models/userModel.js
const db = require('../config/database'); // Kết nối với cơ sở dữ liệu
const bcrypt = require('bcrypt');
const User = require('../entity/userEntity'); // Sử dụng entity User

class UserModel {
  // Đăng ký người dùng mới
  static async createUser(userData) {
    const { username, email, password, full_name, phone, address, role = 'guest' } = userData;

    const query = `INSERT INTO Users (username, email, password, full_name, phone, address, role, status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`;

    const values = [username, email, password, full_name, phone, address, role];
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        const newUser = new User(result.insertId, username, email, password, role, full_name, phone, address);
        resolve(newUser);
      });
    });
  }

  // Lấy thông tin người dùng theo username
  static getUserByUsername(username) {
    const query = 'SELECT * FROM Users WHERE username = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [username], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.length === 0) {
          return resolve(null);  // Nếu không tìm thấy người dùng, trả về null
        }
        resolve(result[0]);  // Trả về người dùng đầu tiên
      });
    });
  }

  // Cập nhật thông tin người dùng
  static updateUserProfile(user_id, updatedData) {
    const { full_name, phone, address } = updatedData;
    const query = 'UPDATE Users SET full_name = ?, phone = ?, address = ? WHERE user_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [full_name, phone, address, user_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  // Lấy toàn bộ người dùng
  static getAllUsers() {
    const query = 'SELECT * FROM Users';
    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = UserModel;
