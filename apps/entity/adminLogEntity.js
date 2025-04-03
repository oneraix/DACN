class AdminLog {
  constructor(log_id, admin_id, action_type, action_details, action_date) {
    this.log_id = log_id;
    this.admin_id = admin_id;
    this.action_type = action_type;
    this.action_details = action_details;
    this.action_date = action_date;
  }
}

module.exports = AdminLog;