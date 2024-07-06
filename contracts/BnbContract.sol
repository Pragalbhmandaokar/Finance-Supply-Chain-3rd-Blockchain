// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyContract {
    uint public myNumber;


     struct Product {
        string productName;
        uint256 expireDate;
        uint256 productID;
    }

    Product product;


    function setMyNumber(uint _myNumber) public {
        myNumber = _myNumber;
    }

    function getMyNumber() public view returns (uint) {
        return myNumber;
    }

     // Function to store product information
    function storeProduct(string memory _productName, uint256 _expireDate, uint256 _productID) public {
        product = Product(_productName, _expireDate, _productID);
    }

    // Function to retrieve product information
    function getProduct() public view returns (Product memory) {
        return product;
    }
}
