// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WidgetsFactory is ERC20, Ownable {
    
    mapping(address => bool) public _managers;        
    uint256 private _stock;
    mapping(uint256 => address) public _acceptedOrder;
    mapping(address => uint256) public _acceptedShip;
    mapping(uint256 => address) public _shipedOrder;
    uint256 public _lastShipedOrder = 0;
    uint256 public _currentOrderId = 0;
    
    constructor() ERC20("WidgetsFactory", "Widgets") {    
        _addManager(msg.sender);    
    }    

    /**
    @dev Add the warehouses manager of factory
    @param user Manager address
   */
    function _addManager(
        address user
    ) public onlyOwner {
        _managers[user] = true;
    }

    /**
    @dev Delete the warehouses manager of factory
    @param user Manager address
   */
    function _deleteManager(
        address user
    ) public onlyOwner {
        _managers[user] = false;
    }

    /**
    @dev Get the amount of stock
    @return uint256 The amount of stock 
   */
    function _getAmount(
    ) public view returns (uint256) {
        return _stock;
    }
    
    /**
    @dev Inventory management in the warehouses is a key part of the system
    @param recipient User address
    @param amount The amount of stocked
   */
    function InventoryManagement(
        address recipient,
        uint256 amount
    ) public {
        require(_managers[recipient] == true, 'Customer can not alter stock in inventory');
        require(amount > 0, 'The factory has not produced the stock');
        
        _stock += amount;
        _mint(address(this), amount);
    }
    
    /**
    @dev A customer is able to place an order for a certain number of widgets
    @param orderor The customer address
    @param amount The order amount
    */
    function OrderPurchase(address orderor, uint256 amount) public payable{
        require(_managers[orderor] == false, "Orderor should not be manager");
        require(_getAmount() > amount, "Not have enough stock");
        require(msg.value > amount * 10 ** 16, "Not have enough funds");

        _acceptedOrder[_currentOrderId] = orderor;
        _acceptedShip[orderor] = amount;
        _stock -= amount;

        _currentOrderId++;
    }

    /**
    @dev Warehouse manager can ship a customer order
    */
    function OrderShip() public {
        require(_managers[msg.sender] == true, "It should be manager");

        uint loop = _currentOrderId - _lastShipedOrder;
        if (loop > 0) {
            for (uint256 i = 0; i < loop; i++) {
                _shipedOrder[_lastShipedOrder] = _acceptedOrder[_lastShipedOrder];
                _transfer(address(this), _acceptedOrder[_lastShipedOrder], _acceptedShip[_acceptedOrder[_lastShipedOrder]]);
                _lastShipedOrder++;
            }
        }        
    }
}