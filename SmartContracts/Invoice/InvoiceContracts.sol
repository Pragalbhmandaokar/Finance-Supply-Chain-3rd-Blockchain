// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnhancedInvoiceContract {
    struct Invoice {
        uint invoiceId;
        address supplier;
        address buyer;
        uint amount;
        bool approved;
        bool paid;
        uint approvalTimestamp;
        uint paymentTimestamp;
    }

    uint private invoiceCounter = 0;
    mapping(uint => Invoice) public invoices;

    event InvoiceCreated(uint indexed invoiceId, address indexed supplier, address indexed buyer, uint amount);
    event InvoiceApproved(uint indexed invoiceId, address indexed buyer);
    event InvoicePaid(uint indexed invoiceId, address indexed buyer, uint amount);

    function createInvoice(address _buyer, uint _amount) external {
        invoiceCounter++;
        invoices[invoiceCounter] = Invoice(invoiceCounter, msg.sender, _buyer, _amount, false, false, 0, 0);
        emit InvoiceCreated(invoiceCounter, msg.sender, _buyer, _amount);
    }

    function approveInvoice(uint _invoiceId) external {
        require(msg.sender == invoices[_invoiceId].buyer, "Only the designated buyer can approve this invoice.");
        require(!invoices[_invoiceId].approved, "This invoice has already been approved.");
        invoices[_invoiceId].approved = true;
        invoices[_invoiceId].approvalTimestamp = block.timestamp;
        emit InvoiceApproved(_invoiceId, msg.sender);
    }

    function payInvoice(uint _invoiceId) external payable {
        require(msg.sender == invoices[_invoiceId].buyer, "Only the designated buyer can pay this invoice.");
        require(invoices[_invoiceId].approved, "Invoice must be approved before payment.");
        require(!invoices[_invoiceId].paid, "This invoice has already been paid.");
        require(msg.value == invoices[_invoiceId].amount, "Payment amount must match the invoice.");

        invoices[_invoiceId].paid = true;
        invoices[_invoiceId].paymentTimestamp = block.timestamp;
        emit InvoicePaid(_invoiceId, msg.sender, msg.value);
    }

    function getInvoice(uint _invoiceId) public view returns (Invoice memory) {
        return invoices[_invoiceId];
    }
}
