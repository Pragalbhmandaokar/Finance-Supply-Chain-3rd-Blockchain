// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SCFManagement {
    struct FinancingRequest {
        uint requestId;
        uint bankId;
        uint supplierId;
        uint amount;
        bool approved;
        bool disbursed;
        uint approvalTimestamp;
        uint disbursementTimestamp;
    }

    uint private financingRequestCounter = 0;
    mapping(uint => FinancingRequest) public financingRequests;

    event FinancingRequestCreated(uint indexed requestId, uint indexed bankId, uint indexed supplierId, uint amount);
    event FinancingRequestApproved(uint indexed requestId, uint indexed bankId);
    event FinancingDisbursed(uint indexed requestId, uint indexed bankId, uint amount);

    function createFinancingRequest(uint _bankId, uint _supplierId, uint _amount) external {
        financingRequestCounter++;
        financingRequests[financingRequestCounter] = FinancingRequest(financingRequestCounter, _bankId, _supplierId, _amount, false, false, 0, 0);
        emit FinancingRequestCreated(financingRequestCounter, _bankId, _supplierId, _amount);
    }

    function approveFinancingRequest(uint _requestId) external {
        FinancingRequest storage request = financingRequests[_requestId];
        require(!request.approved, "Financing request already approved.");
        request.approved = true;
        request.approvalTimestamp = block.timestamp;
        emit FinancingRequestApproved(_requestId, request.bankId);
    }

    function disburseFunds(uint _requestId) external payable {
        FinancingRequest storage request = financingRequests[_requestId];
        require(request.approved, "Financing request not approved.");
        require(!request.disbursed, "Funds already disbursed.");
        require(msg.value == request.amount, "Incorrect disbursement amount.");

        request.disbursed = true;
        request.disbursementTimestamp = block.timestamp;
        emit FinancingDisbursed(_requestId, request.bankId, msg.value);
    }

    function getFinancingRequest(uint _requestId) external view returns (FinancingRequest memory) {
        return financingRequests[_requestId];
    }
}
