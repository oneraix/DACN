const db = require('../config/database');

const getBookingById = (bookingId, userId) => {
    const query = `SELECT * FROM bookings WHERE booking_id = ? AND user_id = ? AND payment_status = 'pending'`;
    return new Promise((resolve, reject) => {
        db.query(query, [bookingId, userId], (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        });
    });
};

const insertPaymentRecord = (paymentData) => {
    const query = `
        INSERT INTO payments (booking_id, payment_method, amount, payment_status) 
        VALUES (?, ?, ?, ?)
    `;
    const { booking_id, payment_method, amount, payment_status } = paymentData;

    return new Promise((resolve, reject) => {
        db.query(query, [booking_id, payment_method, amount, payment_status], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const updatePaymentStatus = (bookingId, status) => {
    const query = `UPDATE payments SET payment_status = ? WHERE booking_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [status, bookingId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const updateBookingStatus = (bookingId, status) => {
    const query = `UPDATE bookings SET payment_status = ? WHERE booking_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [status, bookingId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

module.exports = { getBookingById, insertPaymentRecord, updatePaymentStatus, updateBookingStatus };
