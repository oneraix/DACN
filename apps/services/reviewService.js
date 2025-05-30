const ReviewModel = require('../models/reviewModel');

// Service: Tạo review
const createReview = async (reviewData) => {
    try {
        const result = await ReviewModel.createReview(reviewData);
        return result;
    } catch (error) {
        throw new Error('Error creating review: ' + error.message);
    }
};

// Service: Lấy review theo homestay_id
// const getReviewsByHomestayId = async (homestay_id) => {
//     try {
//         const reviews = await ReviewModel.getReviewsByHomestayId(homestay_id);
//         return reviews;
//     } catch (error) {
//         throw new Error('Error fetching reviews: ' + error.message);
//     }
// };

// Service: Lấy review theo tên homestay hoặc 20 review mới nhất
const getReviewsByHomestayName = async (homestay_name = '') => {
    try {
        const reviews = await ReviewModel.getReviewsByHomestayName(homestay_name);
        return reviews;
    } catch (error) {
        throw new Error('Error fetching reviews: ' + error.message);
    }
};


const deleteReviewById = async (review_id) => {
    try {
        const result = await ReviewModel.deleteReviewById(review_id);
        if (result.affectedRows === 0) {
            throw new Error('Review not found');
        }
        return { message: 'Review deleted successfully', review_id };
    } catch (error) {
        throw new Error('Error deleting review: ' + error.message);
    }
};

const checkReviewPermission = async (user_id, homestay_id) => {
    try {
        const hasPermission = await ReviewModel.checkReviewPermission(user_id, homestay_id);

        if (!hasPermission) {
            return {
                allowed: false,
                message: "You either have no completed booking or have already reviewed this homestay."
            };
        }

        return { allowed: true };
    } catch (error) {
        throw new Error('Error checking review permission: ' + error.message);
    }
};


const getReviewsByHomestayId = async (homestay_id) => {
    try {
        const reviews = await ReviewModel.getReviewsByHomestayId(homestay_id);
        return reviews;
    } catch (error) {
        throw new Error('Error fetching reviews: ' + error.message);
    }
};

module.exports = {
    getReviewsByHomestayId
};


module.exports = { createReview, getReviewsByHomestayId, getReviewsByHomestayName, deleteReviewById, checkReviewPermission };
