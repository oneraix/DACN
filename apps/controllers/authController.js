const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const emailValidator = require('email-validator');//kiểm tra định dạng email

// Đăng ký người dùng mới
exports.register = async (req, res) => {
    const { username, email, full_name, password } = req.body;

    if (!username || !email || !full_name || !password) {    // Kiểm tra xem tất cả các trường có được điền đầy đủ không
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!emailValidator.validate(email)) {    // Kiểm tra định dạng email
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Kiểm tra xem username có chứa ký tự đặc biệt hoặc trống không
    const usernameRegex = /^[a-zA-Z0-9]+$/;  // Chỉ cho phép chữ cái và số, không có ký tự đặc biệt
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: 'Username can only contain alphanumeric characters' });
    }

    try {
        const existingUser = await userService.checkUserExistence(username, email);        // Kiểm tra xem email hoặc username đã tồn tại trong DB chưa
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const result = await userService.register({ username, email, full_name, password });        // Gọi service để thực hiện đăng ký người dùng

        return res.status(201).json(result);        // Trả về thông tin người dùng đã đăng ký thành công
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Hàm đăng nhập tài khoản
exports.login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
        return res.status(400).json({ message: 'Thông tin đăng nhập là bắt buộc' }); // Kiểm tra xem các trường có đầy đủ không
    }

    try {
        const user = await userService.login(usernameOrEmail, password);

        if (!user) {
            return res.status(401).json({ message: 'Thông tin đăng nhập không đúng' }); // Thông báo khi không tìm thấy tài khoản hoặc mật khẩu không đúng
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },process.env.JWT_SECRET,{ expiresIn: '1h' }  // Tạo token JWT
        );

        return res.status(200).json({        // Trả về token và thông tin người dùng
            message: 'Đăng nhập thành công',
            token,
            user: user // Trả về thông tin user
        });

    } catch (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({
            message: 'Lỗi server',
            error: err.message || err
        });
    }
};