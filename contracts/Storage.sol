// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
    uint256 number;

    struct Product {
        string productName;
        uint256 expireDate;
        uint256 productID;
    }

    Product product;
    
    function store(uint256 num) public {
        number = num;
    }

    function retrieve() public view returns (uint256){
        return number;
    }


    //Product add 
     function storeProduct(string memory _productName, uint256 _expireDate, uint256 _productID) public {
        product = Product(_productName, _expireDate, _productID);
    }
     function getProduct() public view returns (Product memory) {
        return product;
    }
}
