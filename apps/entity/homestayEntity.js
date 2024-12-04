// apps/models/homestayEntity.js
class Homestay {
    constructor(homestay_id, host_id, name, description, location, price, amenities, images, available, created_at, updated_at) {
      this.homestay_id = homestay_id;
      this.host_id = host_id;
      this.name = name;
      this.description = description;
      this.location = location;
      this.price = price;
      this.amenities = amenities;
      this.images = images;
      this.available = available;
      this.created_at = created_at;
      this.updated_at = updated_at;
    }
  }
  
  module.exports = Homestay;
  