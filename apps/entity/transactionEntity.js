// apps/models/transactionEntity.js
class Transaction {
    constructor(transaction_id, booking_id, transaction_type, amount, transaction_date, transaction_status) {
      this.transaction_id = transaction_id;
      this.booking_id = booking_id;
      this.transaction_type = transaction_type;
      this.amount = amount;
      this.transaction_date = transaction_date;
      this.transaction_status = transaction_status;
    }
  }
  
  module.exports = Transaction;
  