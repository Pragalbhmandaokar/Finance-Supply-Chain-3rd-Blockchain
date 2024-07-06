"use strict";

const { Contract } = require("fabric-contract-api");

class CompanyContract extends Contract {
  async initLedger(ctx) {
    console.log("Initialization of the ledger");
  }

  async registerCompany(
    ctx,
    companyAddress,
    name,
    companyType,
    country,
    contract,
    credit_rating,
    blockchain_network,
    verified,
    sort_code,
    post_code
  ) {
    const clientOrg = ctx.clientIdentity.getMSPID();
    if (clientOrg !== "CompanyMSP") {
      throw new Error(
        `Client of org ${clientOrg} is not authorized to create a token `
      );
    }

    // get id of the user
    const minter = ctx.clientIdentity.getID();

    const company = {
      docType: "company",
      name,
      companyType,
      country,
      contract,
      credit_rating,
      blockchain_network,
      verified,
      sort_code,
      post_code,
      registrationDate: new Date().toISOString(),
      minter,
    };

    await ctx.stub.putState(
      companyAddress,
      Buffer.from(JSON.stringify(company))
    );
    console.log(`Company ${name} registered successfully.`);
    return JSON.stringify(company);
  }

  async getCompany(ctx, companyAddress) {
    const companyBytes = await ctx.stub.getState(companyAddress);
    if (!companyBytes || companyBytes.length === 0) {
      throw new Error(`Company with address ${companyAddress} does not exist.`);
    }
    console.log(`Company retrieved: ${companyBytes.toString()}`);
    return companyBytes.toString();
  }

  async getCompanyList(ctx) {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
        if (record.docType === "company") {
          allResults.push({ Key: result.value.key, Record: record });
        }
      } catch (err) {
        console.log(err);
        result = await iterator.next();
        continue;
      }
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}

module.exports = CompanyContract;
