const db = require('../config/database'); // Kết nối với cơ sở dữ liệu

class HomestayModel {

static createHomestay(data) {
    const { host_id, name, description, location, price, images, beds, rooms, max_guests, category_id } = data;

    const query = `
      INSERT INTO homestays (
        host_id, name, description, location, price, images, beds, rooms, max_guests, category_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [host_id, name, description, location, price, images, beds, rooms, max_guests, category_id];

    console.log('Executing query:', query, values); // Chuyển xuống sau khi khai báo

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve({ homestay_id: result.insertId, ...data });
      });
    });
}

  static createHomestayAmenity(homestayId, amenityId) {
    const query = `
      INSERT INTO homestay_amenities (homestay_id, amenity_id) VALUES (?, ?)
    `;

    const values = [homestayId, amenityId];

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }


  static getAllHomestays(available = null) {
    let query = 'SELECT * FROM homestays';
    const values = [];
  
    if (available !== null) {
      query += ' WHERE available = ?';
      values.push(available);
    }
  
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  static getHomestayById(id) {
    const query = `
      SELECT 
        h.*, 
        c.category_name,
        GROUP_CONCAT(a.name) AS amenities
      FROM 
        homestays h
      LEFT JOIN 
        categories c ON h.category_id = c.category_id
      LEFT JOIN 
        homestay_amenities ha ON h.homestay_id = ha.homestay_id
      LEFT JOIN 
        amenities a ON ha.amenity_id = a.amenity_id
      WHERE 
        h.homestay_id = ?
      GROUP BY 
        h.homestay_id
    `;
  
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



// static searchHomestay(filters) {
//   let query = `
//     SELECT 
//       h.homestay_id,
//       h.name,
//       REVERSE(SUBSTRING_INDEX(REVERSE(h.location), ',', 2)) AS location, -- Lấy 2 phần cuối cùng của location
//       h.price,
//       h.max_guests,
//       h.beds,
//       h.rooms,
//       h.available,
//       SUBSTRING_INDEX(h.images, ',', 1) AS image, -- Lấy ảnh đầu tiên từ danh sách hình ảnh
//       COUNT(r.review_id) AS review_count, -- Số lượng review
//       ROUND(AVG(IFNULL(r.rating, 0)), 1) AS average_rating -- Trung bình rating (nếu không có thì trả về 0)
//     FROM homestays h
//     LEFT JOIN reviews r ON h.homestay_id = r.homestay_id
//     WHERE 1=1
//   `;

//   const values = [];

//   // Áp dụng các bộ lọc
//   if (filters.location) {
//     query += ' AND h.location LIKE ?';
//     values.push(`%${filters.location}%`);
//   }
//   if (filters.priceMin) {
//     query += ' AND h.price >= ?';
//     values.push(filters.priceMin);
//   }
//   if (filters.priceMax) {
//     query += ' AND h.price <= ?';
//     values.push(filters.priceMax);
//   }
//   if (filters.guests) {
//     query += ' AND h.max_guests >= ?';
//     values.push(filters.guests);
//   }
//   if (filters.rooms) {
//     query += ' AND h.rooms >= ?';
//     values.push(filters.rooms);
//   }

//   // Nhóm và sắp xếp
//   query += `
//     GROUP BY h.homestay_id
//     ORDER BY average_rating DESC, review_count DESC
//   `;

//   // Thực thi truy vấn
//   return new Promise((resolve, reject) => {
//     db.query(query, values, (err, result) => {
//       if (err) {
//         return reject(new Error('Error executing search query: ' + err.message));
//       }
//       resolve(result);
//     });
//   });
// }

static searchHomestay(filters, userId) {
  let query = `
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
        COUNT(r.review_id) AS review_count,
        ROUND(AVG(IFNULL(r.rating, 0)), 1) AS average_rating,
        CASE 
            WHEN EXISTS (
                SELECT 1 
                FROM wishlist wl 
                WHERE wl.homestay_id = h.homestay_id 
                  AND wl.user_id = ?
            ) THEN 1 
            ELSE 0 
        END AS wishlist_homestay
    FROM homestays h
    LEFT JOIN reviews r ON h.homestay_id = r.homestay_id
    WHERE 1=1
  `;

  const values = [userId || null];

  // Xử lý location: Loại bỏ dấu trước khi so sánh
  if (filters.location) {
    const locationKeywords = filters.location
      .normalize('NFD') // Chuyển đổi sang dạng Normalization Form D
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
      .split(' ')
      .map(keyword => `%${keyword}%`);

    query += ` AND (${locationKeywords.map(() => `CONVERT(h.location USING utf8) LIKE ?`).join(' AND ')})`;
    values.push(...locationKeywords);
  }

  // Xử lý các điều kiện khác
  if (filters.priceMin !== undefined) {
    query += ' AND h.price >= ?';
    values.push(filters.priceMin);
  }
  if (filters.priceMax !== undefined) {
    query += ' AND h.price <= ?';
    values.push(filters.priceMax);
  }
  if (filters.guests !== undefined) {
    query += ' AND h.max_guests >= ?';
    values.push(filters.guests);
  }
  if (filters.rooms !== undefined) {
    query += ' AND h.rooms >= ?';
    values.push(filters.rooms);
  }
  if (filters.beds !== undefined) {
    query += ' AND h.beds >= ?';
    values.push(filters.beds);
  }

  // Nhóm và sắp xếp
  query += `
    GROUP BY h.homestay_id
    ORDER BY average_rating DESC, review_count DESC
  `;

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        return reject(new Error('Error executing search query: ' + err.message));
      }
      resolve(result);
    });
  });
}



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

  // static searchHomestay(filters = {}) {
  //   const { location, priceMin, priceMax, guests, rooms } = filters;
  
  //   let query = 'SELECT * FROM homestays WHERE 1=1';
  //   const params = [];
  
  //   if (location) {
  //     query += ' AND location LIKE ?';
  //     params.push(`%${location}%`);
  //   }
  //   if (priceMin !== undefined) {
  //     query += ' AND price >= ?';
  //     params.push(priceMin);
  //   }
  //   if (priceMax !== undefined) {
  //     query += ' AND price <= ?';
  //     params.push(priceMax);
  //   }
  //   if (guests !== undefined) {
  //     query += ' AND max_guests >= ?';
  //     params.push(guests);
  //   }
  //   if (rooms !== undefined) {
  //     query += ' AND rooms >= ?';
  //     params.push(rooms);
  //   }
  
  //   if (Object.keys(filters).length === 0) {
  //     query = 'SELECT * FROM homestays ORDER BY created_at DESC LIMIT 12';
  //     return new Promise((resolve, reject) => {
  //       db.query(query, (err, result) => {
  //         if (err) {
  //           return reject(err);
  //         }
  //         resolve(result);
  //       });
  //     });
  //   }
  
  //   return new Promise((resolve, reject) => {
  //     db.query(query, params, (err, result) => {
  //       if (err) {
  //         return reject(err);
  //       }
  //       resolve(result);
  //     });
  //   });
  // }
  
static getCategory() {
  const query = 'SELECT * FROM categories'; // Lệnh SQL để lấy tất cả ccategory homestay

  return new Promise((resolve, reject) => {
    db.query(query, (err,result) => {
      if (err) {
        return reject(err); // Xử lý lỗi
      }
      resolve(result); // Trả về danh sách category
    });
  });
}


// static searchHomestay(filters, userId) {
//   let query = `
//       SELECT 
//           h.homestay_id,
//           h.name,
//           REVERSE(SUBSTRING_INDEX(REVERSE(h.location), ',', 2)) AS location,
//           h.price,
//           h.max_guests,
//           h.beds,
//           h.rooms,
//           h.available,
//           SUBSTRING_INDEX(h.images, ',', 1) AS image,
//           COUNT(r.review_id) AS review_count,
//           ROUND(AVG(IFNULL(r.rating, 0)), 1) AS average_rating,
//           IF(wl.user_id IS NOT NULL, 1, 0) AS wishlist_homestay
//       FROM homestays h
//       LEFT JOIN reviews r ON h.homestay_id = r.homestay_id
//       LEFT JOIN wishlist wl ON h.homestay_id = wl.homestay_id AND wl.user_id = ?
//       WHERE 1=1
//   `;
//   const values = [userId || null];

//   // Áp dụng các bộ lọc
//   if (filters.location) {
//       query += ' AND h.location LIKE ?';
//       values.push(`%${filters.location}%`);
//   }
//   if (filters.priceMin) {
//       query += ' AND h.price >= ?';
//       values.push(filters.priceMin);
//   }
//   if (filters.priceMax) {
//       query += ' AND h.price <= ?';
//       values.push(filters.priceMax);
//   }
//   if (filters.guests) {
//       query += ' AND h.max_guests >= ?';
//       values.push(filters.guests);
//   }
//   if (filters.rooms) {
//       query += ' AND h.rooms >= ?';
//       values.push(filters.rooms);
//   }

//   // Nhóm và sắp xếp
//   query += `
//       GROUP BY h.homestay_id
//       ORDER BY average_rating DESC, review_count DESC
//   `;

//   return new Promise((resolve, reject) => {
//       db.query(query, values, (err, result) => {
//           if (err) {
//               console.error('SQL Error:', err.message);
//               return reject(new Error('Error executing search query: ' + err.message));
//           }
//           resolve(result);
//           console.log('Query Result:', result);

//       });
//   });
// }



static getUnavailableHomestays() {
  const query = `
    SELECT 
      h.homestay_id,
      h.name AS homestay_name,
      h.location,
      h.description,
      h.beds,
      h.rooms,
      h.max_guests,
      c.category_name,
      u.full_name AS host_name,
      u.email AS host_email,
      u.phone AS host_phone,
      u.address AS host_address,
      h.images,
      GROUP_CONCAT(a.name SEPARATOR ', ') AS amenities
    FROM homestays h
    LEFT JOIN categories c ON h.category_id = c.category_id
    LEFT JOIN users u ON h.host_id = u.user_id
    LEFT JOIN homestay_amenities ha ON h.homestay_id = ha.homestay_id
    LEFT JOIN amenities a ON ha.amenity_id = a.amenity_id
    WHERE h.available = 0
    GROUP BY h.homestay_id
  `;

  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching unavailable homestays:', err.message);
        return reject(new Error('Error fetching unavailable homestays: ' + err.message));
      }
      resolve(results);
    });
  });
}





static updateAvailability(id, available) {
  const query = `UPDATE homestays SET available = ? WHERE homestay_id = ?`;

  return new Promise((resolve, reject) => {
    db.query(query, [available, id], (err, result) => {
      if (err) {
        console.error('Error updating availability:', err.message);
        return reject(err);
      }
      console.log('Database update result:', result);
      resolve(result);
    });
  });
}


static getHomestaysByHostId(hostId) {
  const query = `
    SELECT 
      h.homestay_id,
      h.name AS homestay_name,
      h.location,
      h.price,
      h.description,
      h.available,
      h.images,
      c.category_name,
      GROUP_CONCAT(a.name) AS amenities
    FROM homestays h
    LEFT JOIN categories c ON h.category_id = c.category_id
    LEFT JOIN homestay_amenities ha ON h.homestay_id = ha.homestay_id
    LEFT JOIN amenities a ON ha.amenity_id = a.amenity_id
    WHERE h.host_id = ?
    GROUP BY h.homestay_id
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [hostId], (err, results) => {
      if (err) {
        return reject(err);
      }
      const processedResults = results.map((homestay) => ({
        ...homestay,
        images: homestay.images ? homestay.images.split(',') : [],
        amenities: homestay.amenities ? homestay.amenities.split(',') : [],
      }));
      resolve(processedResults);
    });
  });
}




static addWishlist(userId, homestayId) {
  return new Promise((resolve, reject) => {
      const query = `
          INSERT INTO wishlist (user_id, homestay_id)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP;
      `;
      db.query(query, [userId, homestayId], (err, result) => {
          if (err) return reject(new Error('Error adding wishlist: ' + err.message));
          resolve(result);
      });
  });
}

static removeWishlist(userId, homestayId) {
  return new Promise((resolve, reject) => {
      const query = `
          DELETE FROM wishlist
          WHERE user_id = ? AND homestay_id = ?;
      `;
      db.query(query, [userId, homestayId], (err, result) => {
          if (err) return reject(new Error('Error removing wishlist: ' + err.message));
          resolve(result);
      });
  });
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
          COUNT(r.review_id) AS review_count,
          ROUND(AVG(IFNULL(r.rating, 0)), 1) AS average_rating
      FROM wishlist wl
      INNER JOIN homestays h ON wl.homestay_id = h.homestay_id
      LEFT JOIN reviews r ON h.homestay_id = r.homestay_id
      WHERE wl.user_id = ?
      GROUP BY h.homestay_id
      ORDER BY wl.created_at DESC
  `;

  return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, result) => {
          if (err) {
              console.error('SQL Error:', err.message);
              return reject(new Error('Error executing wishlist query: ' + err.message));
          }
          resolve(result);
      });
  });
}





// Thêm danh mục Homestay
static addCategory(category_name) {
  const query = `
    INSERT INTO categories (category_name)
    VALUES (?)
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [category_name], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve({ category_id: result.insertId, category_name });
    });
  });
}

// Sửa danh mục Homestay
static updateCategory(id, category_name) {
  const query = `
    UPDATE categories
    SET category_name = ?
    WHERE category_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [category_name, id], (err, result) => {
      if (err) {
        return reject(err);
      }
      if (result.affectedRows > 0) {
        resolve({ category_id: id, category_name });
      } else {
        resolve(null);
      }
    });
  });
}

// Xóa danh mục Homestay
static deleteCategory(id) {
  const query = `
    DELETE FROM categories
    WHERE category_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result.affectedRows > 0);
    });
  });
}




}












module.exports = HomestayModel;
