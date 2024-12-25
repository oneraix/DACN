// apps/models/userEntity.js

  
  class User {
    constructor(user_id, username, password, email, role, full_name, phone, address, date_joined, status, last_login, profile_picture) {
      this.user_id = user_id;
      this.username = username;
      this.password = password;
      this.email = email;
      this.role = role;
      this.full_name = full_name;
      this.phone = phone;
      this.address = address;
      this.date_joined = date_joined;
      this.status = status;
      this.last_login = last_login;
      this.profile_picture = profile_picture;
    }
  }
  
  module.exports = User;