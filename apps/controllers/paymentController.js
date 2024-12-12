const paymentService = require('../services/paymentService');  // Import service xử lý thanh toán
const bookingModel = require('../models/bookingModel');  // Import model booking

// API xử lý yêu cầu thanh toán từ người dùng
const createPayment = async (req, res) => {
    const { bookingId, totalAmount } = req.body;  // Lấy thông tin từ request body

    try {
        // Gọi service để tạo URL thanh toán VNPay
        const paymentUrl = paymentService.createVNPayTransaction(bookingId, totalAmount);

        // Chuyển hướng người dùng đến trang thanh toán VNPay (trực tiếp từ server)
        res.json({ paymentUrl });
        //res.redirect(paymentUrl);
    } catch (error) {
        console.error("Error creating VNPay transaction:", error);
        res.status(500).json({ message: "Lỗi khi tạo yêu cầu thanh toán: " + error.message });
    }
};

// API nhận kết quả từ VNPay (callback)
const handleVNPayReturn = async (req, res) => {
    const { vnp_TransactionRef, vnp_TransactionNo, vnp_ResponseCode, vnp_OrderInfo, vnp_Amount, vnp_SecureHash } = req.query;

    // Kiểm tra chữ ký (secure hash) từ VNPay
    const isValidSignature = paymentService.verifySignature(req.query, vnp_SecureHash);
    
    if (isValidSignature) {
        if (vnp_ResponseCode === '00') {
            try {
                const amount = parseInt(vnp_Amount) / 100; // Chuyển số tiền từ đồng về VND
                const result = await paymentService.processPaymentSuccess(vnp_OrderInfo, vnp_TransactionNo, amount);
                
                if (result.success) {
                    res.status(200).json({ message: 'Thanh toán thành công' });
                } else {
                    res.status(400).json({ message: result.message });
                }
            } catch (error) {
                res.status(500).json({ message: 'Lỗi khi xử lý thanh toán: ' + error.message });
            }
        } else {
            res.status(400).json({ message: 'Thanh toán thất bại. Mã phản hồi: ' + vnp_ResponseCode });
        }
    } else {
        res.status(400).json({ message: 'Chữ ký không hợp lệ' });
    }
};

module.exports = {
    createPayment,
    handleVNPayReturn
};
