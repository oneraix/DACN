// apps/models/bookingEntity.js
class Booking {
    constructor(booking_id, guest_id, homestay_id, check_in, check_out, total_amount, status, payment_status, booking_date, updated_at) {
      this.booking_id = booking_id;
      this.guest_id = guest_id;
      this.homestay_id = homestay_id;
      this.check_in = check_in;
      this.check_out = check_out;
      this.total_amount = total_amount;
      this.status = status;
      this.payment_status = payment_status;
      this.booking_date = booking_date;
      this.updated_at = updated_at;
    }
  }
  
  module.exports = Booking;
  