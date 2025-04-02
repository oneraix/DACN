const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');
const paymentModel = require('../models/paymentModel'); 

const createMoMoPayment = async (bookingId, totalAmount, userId) => {
    const partnerCode = 'MOMO';
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const requestId = `${partnerCode}_${Date.now()}`;
    const orderId = `${partnerCode}_BOOKING_${bookingId}_${Date.now()}`;
    const orderInfo = `Payment for booking ${bookingId}`;
    const redirectUrl = 'http://localhost:3000/momocallback';
    const ipnUrl = 'http://localhost:3000/api/payments/momo-callback';
    const requestType = 'payWithCC';
    const extraData = `userId=${userId}`;
    const amount = totalAmount.toString();

    // Tạo rawSignature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    console.log('Raw Signature:', rawSignature);

    // Tạo signature
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
    console.log('Signature:', signature);

    // Dữ liệu gửi đến MoMo
    const requestBody = JSON.stringify({
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'en',
    });

    console.log('Request Body:', requestBody);

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const response = JSON.parse(data);
                console.log('MoMo Response:', response);

                if (response.resultCode === 0) {
                    resolve(response.payUrl); // Trả về URL thanh toán thành công
                } else {
                    reject(new Error(`MoMo payment failed: ${response.message}`));
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with MoMo request: ${e.message}`);
            reject(e);
        });

        req.write(requestBody);
        req.end();
    });
};



const updatePaymentStatus = async (bookingId, status) => {
    try {
        await paymentModel.updatePaymentStatus(bookingId, status);
    } catch (error) {
        console.error(`Error updating payment status for booking ${bookingId}:`, error.message);
        throw error;
    }
};

const updateBookingStatus = async (bookingId, status) => {
    try {
        await paymentModel.updateBookingStatus(bookingId, status);
    } catch (error) {
        console.error(`Error updating booking status for booking ${bookingId}:`, error.message);
        throw error;
    }
};

const insertPaymentRecord = async (paymentData) => {
    try {
        const result = await paymentModel.insertPaymentRecord(paymentData);
        return result;
    } catch (error) {
        console.error('Error inserting payment record:', error.message);
        throw error;
    }
};


const createVNPayPayment = (bookingId, totalAmount, userId) => {
    const vnp_TmnCode = 'RSDIALQ7'; // Mã TmnCode của bạn
    const vnp_HashSecret = 'R0DF9SB1APLWNC7W3PJ85Q8CB67STZSN'; // Secret key
    const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // URL thanh toán VNPay
    const vnp_ReturnUrl = 'http://localhost:3000/payments/vnpay-success'; // URL chuyển hướng khi thanh toán thành công
    const vnp_IpnUrl = 'http://localhost:3000/api/payments/vnpay-callback'; // URL callback khi thanh toán thành công

    const date = new Date();
    const vnp_TxnRef = `${bookingId}_${date.getTime()}`; // Mã giao dịch
    const vnp_OrderInfo = `Payment for booking ${bookingId}`;
    const vnp_Amount = totalAmount * 100; // Đơn vị VNPay tính bằng VND * 100
    const vnp_CreateDate = date.toISOString().replace(/[-T:\.Z]/g, '').substring(0, 14); // Format ngày giờ theo chuẩn VNPay

    const inputData = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode,
        vnp_Amount: vnp_Amount.toString(),
        vnp_CurrCode: 'VND',
        vnp_TxnRef,
        vnp_OrderInfo,
        vnp_OrderType: 'other',
        vnp_Locale: 'vn',
        vnp_ReturnUrl,
        vnp_IpnUrl,
        vnp_CreateDate,
        vnp_IpAddr: '127.0.0.1', // IP máy khách
    };

    // Sắp xếp inputData theo thứ tự tăng dần
    const sortedInput = Object.keys(inputData)
        .sort()
        .reduce((obj, key) => {
            obj[key] = inputData[key];
            return obj;
        }, {});

    const signData = querystring.stringify(sortedInput, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sortedInput.vnp_SecureHash = secureHash;
    console.log('VNPay Input Data:', sortedInput);
    console.log('VNPay SecureHash:', secureHash);
    const paymentUrl = `${vnp_Url}?${querystring.stringify(sortedInput)}`;
    return paymentUrl;
};







module.exports = { createMoMoPayment, createVNPayPayment, updatePaymentStatus,updateBookingStatus, insertPaymentRecord  };
