const paymentService = require('../services/paymentService');

// Tạo thanh toán MoMo
const createMoMoPayment = async (req, res) => {
    const { bookingId, totalAmount } = req.body;
    const userId = req.user.user_id; // userId từ token đã giải mã

    try {
        const paymentUrl = await paymentService.createMoMoPayment(bookingId, totalAmount, userId);
        res.status(200).json({ paymentUrl });
    } catch (error) {
        console.error('Error creating MoMo payment:', error.message);
        res.status(500).json({ message: 'Failed to create MoMo payment.' });
    }
};

// Xử lý callback từ MoMo khi thanh toán hoàn thành
const handleMoMoCallback = async (req, res) => {
    const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature,
    } = req.body;

    try {
        console.log('MoMo Callback Data:', req.body);

        if (!orderId) {
            return res.status(400).json({ message: 'Invalid orderId' });
        }

        const parts = orderId.split('_');
        if (parts.length < 3) {
            return res.status(400).json({ message: 'Invalid orderId format' });
        }

        const bookingId = parts[2]; // Lấy bookingId từ orderId

        if (resultCode === '0') {
            // Thanh toán thành công, cập nhật trạng thái và ghi bản ghi thanh toán
            await paymentService.updatePaymentStatus(bookingId, 'success');
            await paymentService.updateBookingStatus(bookingId, 'paid');

            // Ghi bản ghi vào bảng payments
            const paymentData = {
                booking_id: bookingId,
                payment_method: 'credit_card',
                amount: parseFloat(amount), // Đảm bảo amount là số
                payment_status: 'success',
            };

            await paymentService.insertPaymentRecord(paymentData);

            console.log(`Payment for booking ${bookingId} is successful.`);
            return res.status(200).json({ message: 'Payment successful' });
        } else {
            // Thanh toán thất bại
            console.error(`Payment failed: ${message}`);
            await paymentService.updatePaymentStatus(bookingId, 'failed');
            return res.status(400).json({ message: `Payment failed: ${message}` });
        }
    } catch (error) {
        console.error('MoMo Callback Error:', error.message);
        return res.status(500).json({ message: 'Error processing payment callback.', details: error.message });
    }
};

  



const createVNPayPayment = async (req, res) => {
    const { bookingId, totalAmount } = req.body;
    const userId = req.user.user_id;

    try {
        const paymentUrl = paymentService.createVNPayPayment(bookingId, totalAmount, userId);
        res.status(200).json({ paymentUrl });
        console.log('VNPay Payment URL:', paymentUrl);

    } catch (error) {
        console.error('Error creating VNPay payment:', error.message);
        res.status(500).json({ message: 'Failed to create VNPay payment.' });
    }
};

const handleVNPayCallback = async (req, res) => {
    const vnp_Params = req.query;

    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = Object.keys(vnp_Params)
        .sort()
        .reduce((obj, key) => {
            obj[key] = vnp_Params[key];
            return obj;
        }, {});

    const secretKey = 'VNPAYSECRET'; // VNPay Secret Key
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const generatedHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== generatedHash) {
        return res.status(400).send('Invalid secure hash.');
    }

    const bookingId = vnp_Params['vnp_TxnRef'].split('_')[0];
    const paymentStatus = vnp_Params['vnp_ResponseCode'] === '00' ? 'success' : 'failed';

    try {
        await paymentService.updatePaymentStatus(bookingId, paymentStatus);
        await paymentService.updateBookingStatus(bookingId, paymentStatus === 'success' ? 'paid' : 'pending');
        res.status(200).send(paymentStatus === 'success' ? 'Payment successful' : 'Payment failed');
    } catch (error) {
        console.error('VNPay Callback Error:', error.message);
        res.status(500).send('Error processing VNPay callback.');
    }
};





module.exports = { createMoMoPayment, handleMoMoCallback, createVNPayPayment, handleVNPayCallback };
