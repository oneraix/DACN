module.exports = {
    vnp_TmnCode: 'SIAPCNMT',  // Mã Merchant của bạn
    vnp_HashSecret: 'JNSJ0C2F6D5W7X9EKOA3079LWQGCHHYK' ,  // Key bí mật
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // URL của VNPay
    vnp_ReturnUrl: 'http://localhost:3000/api/bookings/vnpay/callback', // URL trả kết quả thanh toán
    vnp_NotifyUrl: 'http://yourdomain.com/vnpay/notify', // URL VNPay thông báo kết quả thanh toán
};
