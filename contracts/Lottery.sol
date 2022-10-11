//SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

contract Lottery{
    address public admin;
    address payable[] public players; //Because they can get money , I used "payable" 

    constructor() {
        admin = msg.sender;  // Only "admin" is authorized
    } 

    modifier onlyAdmin() {  // Admin's permissions
        require(admin == msg.sender , "Only Admin can call function"); // Necessary limitations have been made with "require"
        _; // Perform all below operations after "require" condition is met
    }  

    // "event" like logging
    event playerInvested(address player , uint amount); // The amount of depositors will also be clearly reported
    event winnerSelected(address winner , uint amount); 


    function invest() payable public { //Invest Money
        require(msg.sender != admin, "Admin cannot invest");
        //limit
        require(msg.value == 0.3 ether , "To join invest 3 ether"); // Everyone who participates will deposit 3 ether
        players.push(payable(msg.sender));  // Adding participants
        emit playerInvested(msg.sender,msg.value);
    }

    function getBalance() public view onlyAdmin returns(uint) { // With "getBalance" method Admin will see all deposited money
        return address(this).balance;


    }

    // A random number is generated to determine the winner
    function random() private view returns(uint){ 
        return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, players.length))); // Keccak : Hashing Algorithm , Generating a number by encoding the resulting "abi" value

    }

    function selectWinner() public onlyAdmin { // Only admin can choose the winner
        uint r=random();
        uint index=r%players.length;
        address payable winner = players[index];
        emit winnerSelected(winner, address(this).balance); // Winner selected by index
        winner.transfer(address(this).balance); // Amount transferred
        players= new address payable[](0); // Players reset




    }
}