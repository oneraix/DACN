// apps/models/userModel.js
const db = require('../config/database'); // Kết nối với cơ sở dữ liệu
const bcrypt = require('bcrypt');
const User = require('../entity/userEntity'); // Sử dụng entity User

class userModel {
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
    const { full_name, phone, address, status, role } = updatedData;

    // Xây dựng một đối tượng để lưu trữ các trường được cập nhật
    const updateFields = [];
    const updateValues = [];

    // Kiểm tra xem mỗi trường có được thay đổi hay không, nếu có thì thêm vào mảng updateFields
    if (full_name !== undefined) {
        updateFields.push('full_name = ?');
        updateValues.push(full_name);
    }
    if (phone !== undefined) {
        updateFields.push('phone = ?');
        updateValues.push(phone);
    }
    if (address !== undefined) {
        updateFields.push('address = ?');
        updateValues.push(address);
    }
    if (status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(status);
    }
    if (role !== undefined) {
        updateFields.push('role = ?');
        updateValues.push(role);
    }

    // Nếu không có trường nào được cập nhật, trả về ngay lập tức
    if (updateFields.length === 0) {
        return Promise.resolve('No data to update');
    }

    // Thêm user_id vào cuối mảng giá trị để truyền vào query
    updateValues.push(user_id);

    // Tạo câu lệnh SQL động
    const query = `UPDATE Users SET ${updateFields.join(', ')} WHERE user_id = ?`;

    return new Promise((resolve, reject) => {
        db.query(query, updateValues, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);  // Trả về kết quả query
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


  static getUserImageById(user_id) {
    const query = 'SELECT profile_picture FROM users WHERE user_id = ?'; // Truy vấn database
    return new Promise((resolve, reject) => {
      db.query(query, [user_id], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return reject(err);
        }
        if (result.length === 0) {
          return resolve(null); // Không tìm thấy user
        }
        resolve(result[0]); // Trả về dòng đầu tiên
      });
    });
  }
}



module.exports = userModel;
