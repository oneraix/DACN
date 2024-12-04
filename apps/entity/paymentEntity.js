// apps/models/paymentEntity.js
class Payment {
    constructor(payment_id, booking_id, payment_method, amount, payment_date, payment_status, transaction_id) {
      this.payment_id = payment_id;
      this.booking_id = booking_id;
      this.payment_method = payment_method;
      this.amount = amount;
      this.payment_date = payment_date;
      this.payment_status = payment_status;
      this.transaction_id = transaction_id;
    }
  }
  
  module.exports = Payment;
  