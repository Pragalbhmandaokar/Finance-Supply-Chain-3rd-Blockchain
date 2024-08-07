"use strict";

const { Contract } = require("fabric-contract-api");

class FinancialContract extends Contract {
  async initLedger(ctx) {
    console.log("Financial Ledger Initialized");
  }

  async createFinancingRequest(ctx, bank, amount, supplier, buyer) {
    const clientOrg = ctx.clientIdentity.getMSPID();
    if (clientOrg !== "FinancialMSP") {
      throw new Error(
        `Client of org ${clientOrg} is not authorized to create a token`
      );
    }

    const requestId = `${supplier}:${Date.now()}`;
    const financingRequest = {
      docType: "financingRequest",
      supplier,
      bank,
      buyer,
      amount,
      approved: false,
      disbursed: false,
      approvalTimestamp: null,
      disbursementTimestamp: null,
    };

    await ctx.stub.putState(
      requestId,
      Buffer.from(JSON.stringify(financingRequest))
    );
    console.log(`Financing Request Created: Request ID ${requestId}`);
    return JSON.stringify(financingRequest);
  }

  async approveFinancingRequest(ctx, requestId) {
    const requestAsBytes = await ctx.stub.getState(requestId);
    if (!requestAsBytes || requestAsBytes.length === 0) {
      throw new Error(`Request ${requestId} does not exist.`);
    }

    const request = JSON.parse(requestAsBytes.toString());
    request.approved = true;
    request.approvalTimestamp = new Date().toISOString();

    await ctx.stub.putState(requestId, Buffer.from(JSON.stringify(request)));
    console.log(`Financing Request Approved: Request ID ${requestId}`);
    return JSON.stringify(request);
  }

  async disburseFunds(ctx, requestId) {
    const requestAsBytes = await ctx.stub.getState(requestId);
    if (!requestAsBytes || requestAsBytes.length === 0) {
      throw new Error(`Request ${requestId} does not exist.`);
    }

    const request = JSON.parse(requestAsBytes.toString());
    if (!request.approved) {
      throw new Error("Request must be approved before disbursement.");
    }
    if (request.disbursed) {
      throw new Error("Funds have already been disbursed.");
    }

    request.disbursed = true;
    request.disbursementTimestamp = new Date().toISOString();

    await ctx.stub.putState(requestId, Buffer.from(JSON.stringify(request)));
    console.log(`Funds Disbursed: Request ID ${requestId}`);
    return JSON.stringify(request);
  }

  async getFinancingRequest(ctx, requestId) {
    const requestAsBytes = await ctx.stub.getState(requestId);
    if (!requestAsBytes || requestAsBytes.length === 0) {
      throw new Error(`Request ${requestId} does not exist.`);
    }
    console.log(`Financing Request Retrieved: Request ID ${requestId}`);
    return requestAsBytes.toString();
  }

  async fetchAllFinancialRequests(ctx) {
    const queryString = {
      selector: {
        docType: "financingRequest",
      },
    };

    const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    const allResults = [];

    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        let record;
        try {
          record = JSON.parse(res.value.value.toString());
        } catch (err) {
          console.log(err);
          record = res.value.value.toString();
        }
        allResults.push(record);
      }
      if (res.done) {
        await iterator.close();
        break;
      }
    }

    console.log("All Financial Requests Retrieved");
    return JSON.stringify(allResults);
  }
}

module.exports = FinancialContract;
