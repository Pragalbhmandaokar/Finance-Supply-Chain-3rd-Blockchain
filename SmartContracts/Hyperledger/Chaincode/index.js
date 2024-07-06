"use strict";

const FinancialContract = require("./libs/FinancialContract");
const CompanyContract = require("./libs/CompanyContract");

module.exports.FinancialContract = FinancialContract;
module.exports.CompanyContract = CompanyContract;
module.exports.contracts = [CompanyContract, FinancialContract];
