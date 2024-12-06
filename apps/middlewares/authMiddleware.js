const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Token đi theo header Authorization
    if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user vào req.user để dùng trong các route sau
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;
