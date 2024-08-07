// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentContract {
    struct Payment {
        uint paymentId;
        address payer;
        address payee;
        uint amount;
        bool confirmed;
        uint paymentTimestamp;
        uint confirmationTimestamp;
    }

    uint private nextPaymentId = 1;
    mapping(uint => Payment) public payments;
    mapping(address => uint[]) public paymentsByPayer;
    mapping(address => uint[]) public paymentsByPayee;

    event PaymentInitiated(uint paymentId, address payer, address payee, uint amount);
    event PaymentConfirmed(uint paymentId, address payee);

    function initiatePayment(address payee, uint amount) public payable returns (uint) {
        require(msg.value == amount, "Payment amount must match the sent value.");
        uint paymentId = nextPaymentId++;
        payments[paymentId] = Payment(paymentId, msg.sender, payee, amount, false, block.timestamp, 0);
        paymentsByPayer[msg.sender].push(paymentId);
        paymentsByPayee[payee].push(paymentId);
        emit PaymentInitiated(paymentId, msg.sender, payee, amount);
        return paymentId;
    }

    function confirmPayment(uint paymentId) public {
        Payment storage payment = payments[paymentId];
        require(msg.sender == payment.payee, "Only the designated payee can confirm this payment.");
        require(!payment.confirmed, "Payment already confirmed.");
        payment.confirmed = true;
        payment.confirmationTimestamp = block.timestamp;
        emit PaymentConfirmed(paymentId, msg.sender);
    }

    function getPayment(uint paymentId) public view returns (Payment memory) {
        return payments[paymentId];
    }
}
