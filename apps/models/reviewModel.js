// apps/models/reviewModel.js
const db = require('../config/database'); // Kết nối với cơ sở dữ liệu
const Review = require('./reviewEntity'); // Sử dụng entity Review

class ReviewModel {
  // Thêm đánh giá mới
  static createReview(reviewData) {
    const { guest_id, homestay_id, rating, review_text } = reviewData;

    const query = `INSERT INTO Reviews (guest_id, homestay_id, rating, review_text)
                   VALUES (?, ?, ?, ?)`;

    const values = [guest_id, homestay_id, rating, review_text];
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        const newReview = new Review(result.insertId, guest_id, homestay_id, rating, review_text);
        resolve(newReview);
      });
    });
  }

  // Lấy thông tin đánh giá theo ID
  static getReviewById(review_id) {
    const query = 'SELECT * FROM Reviews WHERE review_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [review_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result[0]);
      });
    });
  }

  // Lấy tất cả đánh giá của homestay
  static getReviewsByHomestayId(homestay_id) {
    const query = 'SELECT * FROM Reviews WHERE homestay_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [homestay_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  // Cập nhật thông tin đánh giá
  static updateReview(review_id, updatedData) {
    const { rating, review_text } = updatedData;
    const query = 'UPDATE Reviews SET rating = ?, review_text = ? WHERE review_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [rating, review_text, review_id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = ReviewModel;
