// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyContract {
    uint public myNumber;
    struct ProductDetails{
        
        string name;
        uint productId;
        string date;
    }

    // event AssetTransferred(uint256 indexed assetId, address indexed from, address indexed to);

    event AssetAdded(uint id);

    uint[] private productsIDs;
    mapping(uint => ProductDetails) products;
    uint private dataUsageCounter = 0;

    function addProductDetails(
        string memory _name,
        uint  _id,
        string memory _date
    ) public {
        products[_id] =  ProductDetails({
            name: _name,
            productId: _id,
            date: _date
        });
        dataUsageCounter++;
        emit AssetAdded(_id);
    }

    function getProductCounter() public view returns (uint){
        return dataUsageCounter;
    }
    function setMyNumber(uint _myNumber) public {
        myNumber = _myNumber;
    }

    function getMyNumber() public view returns (uint) {
        return myNumber;
    }
}
