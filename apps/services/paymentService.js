const querystring = require('querystring');
const crypto = require('crypto');
const qs = require('qs'); 
const moment = require('moment');
const config = require('../config/vnpay'); // Đảm bảo bạn đã import file config đúng

// Tạo yêu cầu thanh toán VNPay
const createVNPayTransaction = (bookingId, totalAmount, locale = 'vn') => {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');  // Định dạng thời gian cần thiết

    
    // Cấu hình từ file config
    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    const vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;

    // ID đơn hàng và số tiền
    const amount = totalAmount * 100;  // Chuyển đổi thành tiền tệ VNPay yêu cầu

    // Tạo tham số vnp_Params
    const vnpParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: bookingId,  // Mã giao dịch
        vnp_OrderInfo: `Thanh toán cho booking ${bookingId}`,
        vnp_OrderType: 'other',
        vnp_Amount: amount.toString(),
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: '192.168.1.1',
        vnp_CreateDate: createDate,
    };

    // Sắp xếp tham số theo thứ tự alphabet
    const sortedParams = Object.keys(vnpParams)
        .sort()
        .map(key => `${key}=${encodeURIComponent(vnpParams[key])}`)
        .join('&');

    // Tạo chữ ký (secure hash)
    const signData = sortedParams + '&vnp_HashSecret=' + secretKey;
    const hmac = crypto.createHmac('sha512', secretKey);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Thêm chữ ký vào tham số
    vnpParams['vnp_SecureHash'] = secureHash;

    // Tạo URL thanh toán bằng qs.stringify
    const paymentUrl = vnpUrl + '?' + qs.stringify(vnpParams, { encode: false }) + '&vnp_SecureHash=' + secureHash;

    return paymentUrl;
};

const verifySignature = (params, secureHash) => {
    // Sắp xếp các tham số
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');

    // Tạo chữ ký từ các tham số
    const signData = sortedParams + '&vnp_HashSecret=' + config.vnp_HashSecret;
    const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
    const checkHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Kiểm tra chữ ký
    return checkHash === secureHash;
};


// Xử lý thanh toán thành công
const processPaymentSuccess = async (orderInfo, transactionNo, amount) => {
    const bookingId = orderInfo.split(' ')[3]; // Giả sử OrderInfo là 'Thanh toán cho booking 12345'

    try {
        // Thêm bản ghi thanh toán vào bảng payments
        await bookingModel.createPayment(bookingId, amount, transactionNo, '00');
        // Cập nhật trạng thái thanh toán trong bảng bookings
        await bookingModel.updateBookingPaymentStatus(bookingId, 'paid');

        return { success: true };
    } catch (error) {
        console.error("Error processing payment success:", error);
        return { success: false, message: error.message };
    }
};

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
    createVNPayTransaction,
    verifySignature,
    processPaymentSuccess,
    handleVNPayReturn
};
