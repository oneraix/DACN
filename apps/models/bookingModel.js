const db = require('../config/database'); // Kết nối với cơ sở dữ liệu

class BookingModel {
  // Phương thức tạo mới booking
  static createBooking(data) {
    const { user_id, homestay_id, check_in, check_out, adults_count, children_count } = data;

    const query = `
      INSERT INTO bookings (user_id, homestay_id, check_in, check_out, adults_count, children_count)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [user_id, homestay_id, check_in, check_out, adults_count, children_count];

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
    const { status, payment_status } = data;
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

  static getPendingBookingsByHostId(host_id) {
    const query = `
      SELECT b.booking_id, b.check_in, b.check_out, b.total_amount, b.adults_count, b.children_count, 
             h.name AS homestay_name, u.full_name AS guest_name, u.email AS guest_email
      FROM bookings b
      JOIN homestays h ON b.homestay_id = h.homestay_id
      JOIN users u ON b.user_id = u.user_id
      WHERE h.host_id = ? AND b.status = 'pending'
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [host_id], (err, results) => {
        if (err) {
          reject(new Error('Error fetching pending bookings: ' + err.message));
        } else {
          resolve(results); // Trả về danh sách các booking có trạng thái 'pending'
        }
      });
    });
  }

  static updateBookingStatus(id, status) {
    const query = 'UPDATE bookings SET status = ? WHERE booking_id = ?';
    
    return new Promise((resolve, reject) => {
      db.query(query, [status, id], (err, result) => {
        if (err) {
          return reject(err);  // Trả lại lỗi nếu có sự cố
        }
        
        if (result.affectedRows > 0) {
          // Trả về booking đã được cập nhật nếu thành công
          resolve({ booking_id: id, status });
        } else {
          // Nếu không có bản ghi nào được cập nhật, trả về null
          resolve(null);
        }
      });
    });
  }

  static getPendingBookingsByUserId(user_id) {
    const query = `
      SELECT b.booking_id, b.check_in, b.check_out, b.total_amount, b.status, b.payment_status,
             h.name AS homestay_name, h.location AS homestay_location, u.full_name AS guest_name,
             u.email AS guest_email
      FROM bookings b
      JOIN homestays h ON b.homestay_id = h.homestay_id
      JOIN users u ON b.user_id = u.user_id
      WHERE b.user_id = ? AND b.status = 'pending'
      ORDER BY b.booking_date DESC;  /* Sắp xếp theo ngày đặt phòng mới nhất */
    `;
  
    return new Promise((resolve, reject) => {
      db.query(query, [user_id], (err, results) => {
        if (err) {
          reject(new Error('Error fetching pending bookings: ' + err.message));  // Xử lý lỗi
        } else {
          resolve(results);  // Trả về danh sách booking
        }
      });
    });
  }

  static getBookingWaitingPayment(user_id) {
    const query = `
        SELECT 
            b.booking_id,          -- Thêm trường booking_id
            h.name AS homestay_name,
            b.booking_date,
            b.check_in,
            b.check_out,
            b.total_amount
        FROM bookings b
        JOIN homestays h ON b.homestay_id = h.homestay_id
        WHERE b.user_id = ?
          AND b.status = 'confirmed'
          AND b.payment_status = 'pending';
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [user_id], (err, results) => {
          if (err) {
              console.error("Model - Database query error:", err); // Log lỗi query
              return reject(err);
          }
  
          // Chuyển đổi total_amount về kiểu số và thêm booking_id vào kết quả
          const formattedResults = results.map(row => ({
              ...row,
              total_amount: row.total_amount ? parseFloat(row.total_amount) : 0, // Nếu NULL, gán giá trị 0
          }));
          resolve(formattedResults);
      });
    });
}


static getAllBookingsForAdmin() {
  const query = `
      SELECT b.booking_id, u.full_name AS guest_name, b.check_in, b.check_out, b.total_amount,
             h.name AS homestay_name, u2.full_name AS host_name, b.adults_count, b.children_count
      FROM bookings b
      JOIN homestays h ON b.homestay_id = h.homestay_id
      JOIN users u ON b.user_id = u.user_id
      JOIN users u2 ON h.host_id = u2.user_id
  `;

  return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
          if (err) {
              return reject(err);
          }
          resolve(result);
      });
  });
}



static getBookedDatesByHomestayId(homestayId) {
  const query = `
    SELECT DATE_FORMAT(check_in, '%Y-%m-%d') AS check_in, 
           DATE_FORMAT(check_out, '%Y-%m-%d') AS check_out
    FROM bookings 
    WHERE homestay_id = ? AND status IN ('pending', 'confirmed')
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [homestayId], (err, results) => {
      if (err) {
        return reject(err);
      }

      const bookedDates = new Set();

      results.forEach(({ check_in, check_out }) => {
        let currentDate = new Date(check_in); // Tạo đối tượng Date từ check_in
        const endDate = new Date(check_out);

        // Lặp qua từng ngày từ check_in đến ngày trước check_out
        while (currentDate < endDate) {
          const formattedDate = currentDate.toISOString().split('T')[0]; // Chỉ lấy phần ngày yyyy-mm-dd
          bookedDates.add(formattedDate);
          currentDate.setDate(currentDate.getDate() + 1); // Tăng thêm 1 ngày
        }
      });

      resolve([...bookedDates]); // Trả về danh sách các ngày đã được booking
    });
  });
}


}



module.exports = BookingModel;
