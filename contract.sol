pragma solidity ^0.7.4;

import "./2_Owner.sol";

contract GameRoom is Owner {

    struct User {
        int balance;
        bool exists;
    }
    
    mapping(address => User) internal addressToAccount;
    
    function createUser() external {
        require(getExistance() == false);
        addressToAccount[msg.sender] = User(0, true);
    }
    
    function getBalance() public view returns(int) {
        require(getExistance() == true);
        return addressToAccount[msg.sender].balance;
    }
    
    function getExistance() public view returns(bool) {
        return addressToAccount[msg.sender].exists;
    }
    
    function depositBalance() external payable {
        require(getExistance() == true);
        addressToAccount[msg.sender].balance += int(msg.value);
    }
    
    function withdrawBalance(uint _amount, int _tab) external payable {
        require(getExistance() == true);
        msg.sender.transfer(_amount);
        // Only change balance if tab is smaller than withdraw amount
        if (_tab < int(_amount)) {
            addressToAccount[msg.sender].balance -= int(_amount) - _tab;
        }
    }
    
    function balance() external view returns(int) {
        return int(address(this).balance);
    }
    
    //function withdrawContract() external isOwner {
    //    address owner = getOwner();
    //    owner.transfer(address(this).balance);
    //}
}