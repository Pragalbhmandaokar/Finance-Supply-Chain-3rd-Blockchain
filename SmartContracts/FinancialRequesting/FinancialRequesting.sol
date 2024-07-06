// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FinancialContract {
    struct FinancingRequest {
        uint requestId;
        address supplier;
        address buyerId;
        uint amount;
        bool approved;
        bool disbursed;
        uint approvalTimestamp;
        uint disbursementTimestamp;
    }

    uint private nextRequestId = 1;
    mapping(uint => FinancingRequest) public financingRequests;
    mapping(address => uint[]) public requestsBySupplier;
    mapping(address => uint[]) public requestsByBank;

    event FinancingRequestCreated(uint requestId, address supplier, address bank, uint amount);
    event FinancingRequestApproved(uint requestId, address bank);
    event FundsDisbursed(uint requestId, address bank, uint amount);

    function createFinancingRequest(address bank, uint amount) public returns (uint) {
        uint requestId = nextRequestId++;
        financingRequests[requestId] = FinancingRequest(requestId, msg.sender, bank, amount, false, false, 0, 0);
        requestsBySupplier[msg.sender].push(requestId);
        requestsByBank[bank].push(requestId);
        emit FinancingRequestCreated(requestId, msg.sender, bank, amount);
        return requestId;
    }

    function approveFinancingRequest(uint requestId) public {
        FinancingRequest storage request = financingRequests[requestId];
        require(msg.sender == request.bank, "Only the designated bank can approve this request.");
        require(!request.approved, "Request already approved.");
        request.approved = true;
        request.approvalTimestamp = block.timestamp;
        emit FinancingRequestApproved(requestId, msg.sender);
    }

    function disburseFunds(uint requestId) public payable {
        FinancingRequest storage request = financingRequests[requestId];
        require(msg.sender == request.bank, "Only the designated bank can disburse funds for this request.");
        require(request.approved, "Request must be approved before disbursement.");
        require(!request.disbursed, "Funds already disbursed.");
        require(msg.value == request.amount, "Disbursement amount must match the request amount.");

        request.disbursed = true;
        request.disbursementTimestamp = block.timestamp;
        payable(request.supplier).transfer(msg.value);
        emit FundsDisbursed(requestId, msg.sender, msg.value);
    }

    function getFinancingRequest(uint requestId) public view returns (FinancingRequest memory) {
        return financingRequests[requestId];
    }
}
