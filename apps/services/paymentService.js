const https = require('https');
const crypto = require('crypto');

const createMoMoPayment = async (bookingId, totalAmount, userId) => {
    const partnerCode = 'MOMO';
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const requestId = `${partnerCode}_${Date.now()}`;
    const orderId = `${partnerCode}_BOOKING_${bookingId}_${Date.now()}`;
    const orderInfo = `Payment for booking ${bookingId}`;
    const redirectUrl = 'http://localhost:3000/payments/momo-success';
    const ipnUrl = 'http://localhost:3000/api/payments/momo-callback';
    const requestType = 'captureWallet';
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

module.exports = { createMoMoPayment };
