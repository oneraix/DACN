const db = require('../config/database'); // Kết nối với cơ sở dữ liệu

class BookingModel {
  // Phương thức tạo mới booking
  static createBooking(data) {
    const { user_id, homestay_id, check_in, check_out, adults_count, children_count, status } = data;

    const query = `
      INSERT INTO bookings (user_id, homestay_id, check_in, check_out, adults_count, children_count, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [user_id, homestay_id, check_in, check_out, adults_count, children_count, status];
    
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve({ booking_id: result.insertId, ...data });
      });
    });
  }
  // Phương thức lấy tất cả bookings
  static getAllBookings() {
    const query = 'SELECT * FROM bookings';

    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result); // Trả về tất cả bookings
      });
    });
  }

  // Phương thức lấy booking theo ID
  static getBookingById(id) {
    const query = 'SELECT * FROM bookings WHERE booking_id = ?';

    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.length === 0) {
          return resolve(null); // Nếu không tìm thấy booking, trả về null
        }
        resolve(result[0]);
      });
    });
  }

  // Phương thức cập nhật booking theo ID
  static updateBooking(id, data) {
    const { status, payment_status } = data; // Chú ý đổi từ status_payment thành payment_status
  
    // Xây dựng câu lệnh SQL chỉ cập nhật các trường status và payment_status nếu có giá trị
    let query = 'UPDATE bookings SET ';
    let values = [];
  
    // Kiểm tra nếu có giá trị status mới thì cập nhật
    if (status !== undefined) {
      query += 'status = ?, ';
      values.push(status);
    }
  
    // Kiểm tra nếu có giá trị payment_status mới thì cập nhật
    if (payment_status !== undefined) {
      query += 'payment_status = ?, ';  // Sửa lại tên cột ở đây
      values.push(payment_status);
    }
  
    // Loại bỏ dấu phẩy thừa ở cuối câu lệnh SQL
    query = query.slice(0, -2);
  
    query += ' WHERE booking_id = ?';
    values.push(id);
  
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
  
        // Nếu có ít nhất một dòng bị cập nhật, trả về kết quả
        if (result.affectedRows > 0) {
          resolve({ booking_id: id, status, payment_status });
        } else {
          resolve(null); // Trả về null nếu không có dòng nào bị cập nhật
        }
      });
    });
  }
  
  // Phương thức xóa booking theo ID
  static deleteBooking(id) {
    const query = 'DELETE FROM bookings WHERE booking_id = ?';

    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows > 0); // Trả về true nếu xóa thành công
      });
    });
  }

  // Phương thức tính tổng tiền booking dựa trên giá homestay và ngày thuê
  static calculateTotalAmount(homestay_id, check_in, check_out) {
    return new Promise((resolve, reject) => {
      if (!homestay_id || !check_in || !check_out) {
        return reject(new Error('Invalid input parameters'));
      }
  
      // Truy vấn giá homestay từ bảng homestays
      const query = 'SELECT price FROM homestays WHERE homestay_id = ?';
  
      db.query(query, [homestay_id], (err, result) => {
        if (err) {
          return reject(new Error('Error querying homestay: ' + err.message));
        }
  
        if (result.length === 0) {
          return reject(new Error('Homestay not found'));
        }
  
        const pricePerNight = result[0].price;  // Giá của homestay mỗi đêm
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);
  
        // Kiểm tra ngày vào và ngày ra
        if (checkInDate >= checkOutDate) {
          return reject(new Error('Invalid check-in or check-out dates'));
        }
  
        const diffTime = checkOutDate - checkInDate;
        const numberOfNights = diffTime / (1000 * 3600 * 24); // Số ngày thuê
  
        if (numberOfNights <= 0) {
          return reject(new Error('Invalid check-in or check-out dates'));
        }
  
        const totalAmount = pricePerNight * numberOfNights;
        resolve(totalAmount);
      });
    });
  }
  

  // Phương thức lấy tất cả bookings của người dùng theo user_id
  static getBookingsByUserId(user_id) {
    const query = 'SELECT * FROM bookings WHERE user_id = ?';

    return new Promise((resolve, reject) => {
      db.query(query, [user_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result); // Trả về danh sách bookings của người dùng
      });
    });
  }
}

module.exports = BookingModel;
