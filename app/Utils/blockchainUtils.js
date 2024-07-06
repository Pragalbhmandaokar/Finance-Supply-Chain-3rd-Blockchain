const {
  connectionProfileCompany,
  connectionProfileFinancical,
} = require("../config/Blockchain/exportConfig");

const getFinancialCppPath = () => {
  return connectionProfileFinancical;
};

const getCompanyCppPath = () => {
  return connectionProfileCompany;
};

const getNetworkDetails = (serviceDetails) => {
  if (serviceDetails === "Finance") {
    return {
      chainCodeName: "financeChaincode",
      channelName: "financechannel",
    };
  } else if (serviceDetails === "Company") {
    return {
      chainCodeName: "companyChaincode",
      channelName: "companychannel",
    };
  }

  throw new Error("Invalid service details provided");
};

module.exports = {
  getFinancialCppPath,
  getCompanyCppPath,
  getNetworkDetails,
};
