const db = require('../config/database'); // Kết nối với cơ sở dữ liệu

class HomestayModel {
  /**
   * Phương thức tạo mới homestay
   * @param {Object} data - Dữ liệu homestay cần tạo
   * @returns {Object} - Homestay vừa được tạo
   */
  static createHomestay(data) {
    const { host_id, name, description, location, category, price, amenities, images, beds, rooms, max_guests } = data;
    
    const query = `
      INSERT INTO homestays (
        host_id, name, description, location, category, price, amenities, images,
        beds, rooms, max_guests
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      host_id, name, description, location, category, price, amenities, images,
       beds, rooms, max_guests
    ];

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve({ homestay_id: result.insertId, ...data });
      });
    });
  }

  /**
   * Phương thức lấy tất cả homestay
   * @returns {Array} - Mảng tất cả homestay
   */
  static getAllHomestays() {
    const query = 'SELECT * FROM homestays';

    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result); // Trả về danh sách homestays
      });
    });
  }

  /**
   * Phương thức lấy homestay theo ID
   * @param {number} id - ID của homestay
   * @returns {Object|null} - Homestay hoặc null nếu không tìm thấy
   */
  static getHomestayById(id) {
    const query = 'SELECT * FROM homestays WHERE homestay_id = ?';
    
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.length === 0) {
          return resolve(null); // Nếu không tìm thấy homestay, trả về null
        }
        resolve(result[0]); // Trả về homestay đầu tiên
      });
    });
  }

  /**
   * Phương thức cập nhật homestay theo ID
   * @param {number} id - ID của homestay cần cập nhật
   * @param {Object} data - Dữ liệu mới cần cập nhật
   * @returns {Object|null} - Homestay sau khi cập nhật hoặc null nếu không tìm thấy
   */
  static updateHomestay(id, data) {
    const { name, description, location, price, amenities, images, available, beds, rooms, max_guests } = data;
    
    const query = `
      UPDATE homestays SET
        name = ?, description = ?, location = ?, price = ?, amenities = ?,
        images = ?, available = ?, beds = ?, rooms = ?, max_guests = ?
      WHERE homestay_id = ?
    `;

    const values = [
      name, description, location, price, amenities, images, available, 
      beds, rooms, max_guests, id
    ];

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows > 0 ? { ...data, homestay_id: id } : null);
      });
    });
  }

/**
 * Phương thức tìm kiếm homestay theo các điều kiện
 * @param {Object} filters - Các điều kiện tìm kiếm (ví dụ: location, price, max_guests, host_id)
 * @returns {Array} - Mảng các homestay phù hợp với các điều kiện
 */
/**
 * Phương thức tìm kiếm homestay theo các điều kiện
 * @param {Object} filters - Các điều kiện tìm kiếm (location, price, max_guests, host_id,...)
 * @returns {Promise<Array>} - Mảng các homestay phù hợp với các điều kiện
 */
  static searchHomestay(filters) {
  let query = 'SELECT * FROM homestays WHERE 1=1'; // Khởi tạo câu truy vấn mặc định
  const values = [];

  // Xây dựng câu truy vấn dựa trên các điều kiện có trong filters
  if (filters.location) {
    query += ' AND location LIKE ?';
    values.push(`%${filters.location}%`); // Thêm giá trị location tìm kiếm gần đúng
  }
  if (filters.price) {
    query += ' AND price <= ?';
    values.push(filters.price); // Lọc theo giá tối đa
  }
  if (filters.max_guests) {
    query += ' AND max_guests >= ?';
    values.push(filters.max_guests); // Lọc theo số khách tối thiểu
  }
  if (filters.available !== undefined) {
    query += ' AND available = ?';
    values.push(filters.available ? 1 : 0); // Trạng thái khả dụng (true/false)
  }
  if (filters.beds) {
    query += ' AND beds >= ?';
    values.push(filters.beds); // Lọc theo số giường tối thiểu
  }
  if (filters.rooms) {
    query += ' AND rooms >= ?';
    values.push(filters.rooms); // Lọc theo số phòng tối thiểu
  }
  if (filters.host_id) {
    query += ' AND host_id = ?';
    values.push(filters.host_id); // Lọc theo host_id
  }

  // Thực thi câu truy vấn
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        return reject(new Error('Error executing search query: ' + err.message));
      }
      resolve(result); // Trả về danh sách homestay tìm được
    });
  });
  }

  /**
   * Phương thức xóa homestay theo ID
   * @param {number} id - ID của homestay cần xóa
   * @returns {boolean} - True nếu xóa thành công, false nếu không tìm thấy
   */
  static deleteHomestay(id) {
    const query = 'DELETE FROM homestays WHERE homestay_id = ?';
    
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows > 0); // Trả về true nếu xóa thành công
      });
    });
  }


  static getAllAmenities() {
    const query = 'SELECT * FROM amenities'; // Lệnh SQL để lấy tất cả amenities

    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          return reject(err); // Xử lý lỗi
        }
        resolve(result); // Trả về danh sách amenities
      });
    });
  }

  static searchHomestay(filters = {}) {
    const { location, priceMin, priceMax, guests, rooms } = filters;
  
    let query = 'SELECT * FROM homestays WHERE 1=1';
    const params = [];
  
    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }
    if (priceMin !== undefined) {
      query += ' AND price >= ?';
      params.push(priceMin);
    }
    if (priceMax !== undefined) {
      query += ' AND price <= ?';
      params.push(priceMax);
    }
    if (guests !== undefined) {
      query += ' AND max_guests >= ?';
      params.push(guests);
    }
    if (rooms !== undefined) {
      query += ' AND rooms >= ?';
      params.push(rooms);
    }
  
    if (Object.keys(filters).length === 0) {
      query = 'SELECT * FROM homestays ORDER BY created_at DESC LIMIT 12';
      return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    }
  
    return new Promise((resolve, reject) => {
      db.query(query, params, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
  

}




module.exports = HomestayModel;
