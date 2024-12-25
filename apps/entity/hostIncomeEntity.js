class HostIncome {
  constructor(income_id, host_id, total_income, income_date) {
    this.income_id = income_id;
    this.host_id = host_id;
    this.total_income = total_income;
    this.income_date = income_date;
  }
}

module.exports = HostIncome;