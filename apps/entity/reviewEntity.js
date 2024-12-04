// apps/models/reviewEntity.js
class Review {
    constructor(review_id, guest_id, homestay_id, rating, review_text, created_at, updated_at) {
      this.review_id = review_id;
      this.guest_id = guest_id;
      this.homestay_id = homestay_id;
      this.rating = rating;
      this.review_text = review_text;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  }
  
  module.exports = Review;
  