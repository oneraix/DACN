const jwt = require('jsonwebtoken');

// Middleware để xác thực token và kiểm tra quyền
const authenticateUser = (requiredRole = null) => {
    return (req, res, next) => {
      const token = req.header('Authorization')?.replace('Bearer ', ''); // Lấy token từ header
  
      if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token và xác thực
        req.user = decoded; // Lưu thông tin người dùng vào request
  
        // Kiểm tra quyền nếu cần thiết
        if (requiredRole && !requiredRole.includes(req.user.role)) {
          return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }
  
        next(); // Tiếp tục xử lý request nếu token hợp lệ
      } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' }); // Trả về lỗi nếu token không hợp lệ hoặc hết hạn
      }
    };
  };
  

module.exports = authenticateUser;
