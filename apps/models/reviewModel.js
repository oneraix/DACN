const db = require('../config/database');

class ReviewModel {
    // Tạo review
    static createReview({ guest_id, homestay_id, rating, review_text }) {
        const query = `
            INSERT INTO reviews (guest_id, homestay_id, rating, review_text)
            VALUES (?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [guest_id, homestay_id, rating, review_text], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    // Lấy review theo homestay_id
    static getReviewsByHomestayId(homestay_id) {
        const query = `
            SELECT r.review_id, r.guest_id, r.homestay_id, r.rating, r.review_text, r.created_at, 
                   u.username AS guest_name
            FROM reviews r
            JOIN users u ON r.guest_id = u.user_id
            WHERE r.homestay_id = ?
            ORDER BY r.created_at DESC
        `;
        return new Promise((resolve, reject) => {
            db.query(query, [homestay_id], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Lấy review theo tên homestay hoặc 20 review mới nhất
    static getReviewsByHomestayName(homestay_name = '') {
        let query;
        const params = [];

        if (homestay_name) {
            query = `
                SELECT r.review_id, r.guest_id, r.homestay_id, r.rating, r.review_text, r.created_at, 
                       h.name AS homestay_name, u.username AS guest_name
                FROM reviews r
                JOIN homestays h ON r.homestay_id = h.homestay_id
                JOIN users u ON r.guest_id = u.user_id
                WHERE h.name LIKE ?
                ORDER BY r.created_at DESC
            `;
            params.push(`%${homestay_name}%`);
        } else {
            query = `
                SELECT r.review_id, r.guest_id, r.homestay_id, r.rating, r.review_text, r.created_at, 
                       h.name AS homestay_name, u.username AS guest_name
                FROM reviews r
                JOIN homestays h ON r.homestay_id = h.homestay_id
                JOIN users u ON r.guest_id = u.user_id
                ORDER BY r.created_at DESC
                LIMIT 20
            `;
        }

        return new Promise((resolve, reject) => {
            db.query(query, params, (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static deleteReviewById(review_id) {
      const query = 'DELETE FROM reviews WHERE review_id = ?';
      return new Promise((resolve, reject) => {
          db.query(query, [review_id], (err, result) => {
              if (err) {
                  console.error('Database error:', err);
                  reject(err);
              } else {
                  resolve(result);
              }
          });
      });
  }


  static checkReviewPermission(user_id, homestay_id) {
    const queryBooking = `
        SELECT COUNT(*) AS booking_count
        FROM bookings
        WHERE user_id = ? AND homestay_id = ? AND status = 'completed'
    `;

    const queryReview = `
        SELECT COUNT(*) AS review_count
        FROM reviews
        WHERE guest_id = ? AND homestay_id = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(queryBooking, [user_id, homestay_id], (err, bookingResults) => {
            if (err) {
                console.error('Database error (Booking Check):', err);
                return reject(err);
            }

            // Nếu không có booking hợp lệ, trả về false
            if (bookingResults[0].booking_count === 0) {
                return resolve(false);
            }

            // Tiếp tục kiểm tra nếu đã review chưa
            db.query(queryReview, [user_id, homestay_id], (err, reviewResults) => {
                if (err) {
                    console.error('Database error (Review Check):', err);
                    return reject(err);
                }

                // Trả về true nếu có booking hợp lệ và chưa review
                resolve(reviewResults[0].review_count === 0);
            });
        });
    });
}



static getReviewsByHomestayId(homestay_id) {
    const query = `
        SELECT 
            r.review_id,
            r.guest_id,
            r.homestay_id,
            r.rating,
            r.review_text,
            DATE_FORMAT(r.created_at, '%d %b %Y') as review_date,
            u.username AS guest_name,
            u.profile_picture AS guest_avatar
        FROM 
            reviews r
        JOIN 
            users u ON r.guest_id = u.user_id
        WHERE 
            r.homestay_id = ?
        ORDER BY 
            r.created_at DESC
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [homestay_id], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}



}



module.exports = ReviewModel;
