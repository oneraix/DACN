// apps/models/userModel.js
const db = require('../config/database'); // Kết nối với cơ sở dữ liệu
const bcrypt = require('bcrypt');
const User = require('../entity/userEntity'); // Sử dụng entity User

class UserModel {
  static async createUser(userData) {
    const { username, email, password, full_name } = userData;
    const query = `INSERT INTO Users (username, email, password, full_name, status) 
                   VALUES (?, ?, ?, ?, 'active')`;

    const values = [username, email, password, full_name];
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result); 
      });
    });
  }

  //lấy thông tin tài khoản theo user hoặc email
  static async getUserByUsernameOrEmail(usernameOrEmail) {
    const query = 'SELECT * FROM Users WHERE username = ? OR email = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [usernameOrEmail, usernameOrEmail], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.length === 0) {
          return resolve(null);
        }
        resolve(result[0]);
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

  // Cập nhật thông tin tài khoản
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

  // Lấy danh sách tài khoản
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
