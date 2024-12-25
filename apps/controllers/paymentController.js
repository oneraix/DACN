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
    const { orderId, resultCode, message } = req.body; // Lấy dữ liệu từ callback

    try {
        if (resultCode === 0) {
            // Thanh toán thành công, cập nhật trạng thái booking và payment
            const bookingId = orderId.split('_')[2]; // Lấy bookingId từ orderId
            await paymentService.updatePaymentStatus(bookingId, 'success');
            await paymentService.updateBookingStatus(bookingId, 'paid');

            console.log(`Payment for booking ${bookingId} is successful.`);
            res.status(200).send('Payment successful');
        } else {
            // Thanh toán thất bại
            console.error(`Payment failed: ${message}`);
            res.status(400).send('Payment failed');
        }
    } catch (error) {
        console.error('MoMo Callback Error:', error.message);
        res.status(500).send('Error processing payment callback.');
    }
};

module.exports = { createMoMoPayment, handleMoMoCallback };
