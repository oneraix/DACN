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



  static getUserInformationById(user_id) {
    const query = 'SELECT profile_picture, full_name, role FROM users WHERE user_id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [user_id], (err, rows) => {
            if (err) {
                console.error('Error fetching user information:', err);
                return reject(err);
            }
            if (rows.length > 0) {
                resolve(rows[0]);
            } else {
                reject(new Error('User not found'));
            }
        });
    });
}


static async getProfileById(user_id) {
  const query = `
      SELECT full_name, phone, email, address, profile_picture
      FROM users
      WHERE user_id = ?
  `;
  return new Promise((resolve, reject) => {
      db.query(query, [user_id], (err, rows) => {
          if (err) {
              console.error('Error fetching user profile:', err.message);
              return reject(err);
          }
          if (rows.length === 0) {
              return resolve(null);
          }
          resolve(rows[0]);
      });
  });
}


static async getProfileById(user_id) {
  const query = `
      SELECT user_id, full_name, phone, email, address, password, profile_picture
      FROM users
      WHERE user_id = ?
  `;
  return new Promise((resolve, reject) => {
      db.query(query, [user_id], (err, rows) => {
          if (err) {
              console.error('Error fetching user profile:', err.message);
              return reject(err);
          }
          if (rows.length === 0) {
              return resolve(null);
          }
          resolve(rows[0]);
      });
  });
}

// Hàm cập nhật thông tin người dùng
static async updateUserInfo(user_id, updatedFields) {
  const updateKeys = Object.keys(updatedFields);
  const updateValues = Object.values(updatedFields);

  if (updateKeys.length === 0) {
      throw new Error('No fields to update');
  }

  const setClause = updateKeys.map((key) => `${key} = ?`).join(', ');
  const query = `UPDATE users SET ${setClause} WHERE user_id = ?`;

  return new Promise((resolve, reject) => {
      db.query(query, [...updateValues, user_id], (err, result) => {
          if (err) {
              console.error('Error updating user profile:', err.message);
              return reject(err);
          }
          resolve(result);
      });
  });
}


// Cập nhật thông tin người dùng
static async updateUserProfile(user_id, updatedFields) {
  const updateKeys = Object.keys(updatedFields);
  const updateValues = Object.values(updatedFields);

  if (updateKeys.length === 0) {
    throw new Error('No fields to update');
  }

  // Xây dựng phần câu lệnh SET cho query SQL
  const setClause = updateKeys.map((key) => `${key} = ?`).join(', ');
  const query = `UPDATE users SET ${setClause} WHERE user_id = ?`;

  return new Promise((resolve, reject) => {
    db.query(query, [...updateValues, user_id], (err, result) => {
      if (err) {
        console.error('Error updating user profile:', err.message);
        return reject(err);
      }
      resolve(result);
    });
  });
}

// Hàm lấy thông tin người dùng theo ID
static async getProfileById(user_id) {
  const query = `
    SELECT user_id, full_name, phone, email, address, password, profile_picture
    FROM users
    WHERE user_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [user_id], (err, rows) => {
      if (err) {
        console.error('Error fetching user profile:', err.message);
        return reject(err);
      }
      if (rows.length === 0) {
        return resolve(null);
      }
      resolve(rows[0]);
    });
  });
}

// Hàm lấy thông tin người dùng theo ID
static async getProfileById(user_id) {
  const query = `
    SELECT user_id, full_name, phone, email, address, password, profile_picture
    FROM users
    WHERE user_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [user_id], (err, rows) => {
      if (err) {
        console.error('Error fetching user profile:', err.message);
        return reject(err);
      }
      if (rows.length === 0) {
        return resolve(null);
      }
      resolve(rows[0]);
    });
  });
}


static async updateUserPassword(user_id, new_password) {
  const hashedPassword = await bcrypt.hash(new_password, 10);

  const query = `UPDATE users SET password = ? WHERE user_id = ?`;

  try {
    const result = await db.execute(query, [hashedPassword, user_id]);
    // Nếu `db.execute` không trả về mảng, hãy sử dụng trực tiếp `result`
    if (result.affectedRows > 0) {
      return { success: true, message: 'Thay đổi mật khẩu thành công' };
    } else {
      return { success: false, message: 'Mật khẩu giống với mật khẩu hiện tại' };
    }
  } catch (err) {
    console.error('Lỗi cập nhật mật khẩu:', err.message);
    throw err;
  }
}


static getWishlistHomestays(userId) {
  const query = `
      SELECT 
          h.homestay_id,
          h.name,
          REVERSE(SUBSTRING_INDEX(REVERSE(h.location), ',', 2)) AS location,
          h.price,
          h.max_guests,
          h.beds,
          h.rooms,
          h.available,
          SUBSTRING_INDEX(h.images, ',', 1) AS image,
          COUNT(DISTINCT r.review_id) AS review_count,
          ROUND(AVG(IFNULL(r.rating, 0)), 1) AS average_rating,
          MAX(wl.created_at) AS latest_wishlist_time
      FROM wishlist wl
      INNER JOIN homestays h ON wl.homestay_id = h.homestay_id
      LEFT JOIN reviews r ON h.homestay_id = r.homestay_id
      WHERE wl.user_id = ?
      GROUP BY h.homestay_id, h.name, h.location, h.price, h.max_guests, h.beds, h.rooms, h.available, h.images
      ORDER BY latest_wishlist_time DESC;
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('SQL Error:', err.message);
        return reject(new Error('Error executing wishlist query: ' + err.message));
      }
      if (!Array.isArray(result)) {
        console.error('Result is not an array:', result);
        return reject(new Error('Unexpected result format from database'));
      }
      resolve(result);
    });
  });
}



}




module.exports = userModel;
