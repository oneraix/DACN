const reviewService = require('../services/reviewService');

// Controller: Tạo review
const createReview = async (req, res) => {
    const { guest_id, homestay_id, rating, review_text } = req.body;

    try {
        if (!guest_id || !homestay_id || !rating || !review_text) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const result = await reviewService.createReview({ guest_id, homestay_id, rating, review_text });
        res.status(201).json({ message: 'Review created successfully', review_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller: Lấy review theo homestay_id
const getReviewsByHomestayId = async (req, res) => {
    const { homestay_id } = req.params;

    try {
        if (!homestay_id) {
            return res.status(400).json({ message: 'Homestay ID is required' });
        }

        const reviews = await reviewService.getReviewsByHomestayId(homestay_id);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller: Lấy review theo tên homestay hoặc 20 review mới nhất
const getReviewsByHomestayName = async (req, res) => {
    const { homestay_name } = req.query;

    try {
        const reviews = await reviewService.getReviewsByHomestayName(homestay_name);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReviewById = async (req, res) => {
    const { review_id } = req.params;

    try {
        if (!review_id) {
            return res.status(400).json({ message: 'Review ID is required' });
        }

        const result = await reviewService.deleteReviewById(review_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReview, getReviewsByHomestayId, getReviewsByHomestayName, deleteReviewById };
