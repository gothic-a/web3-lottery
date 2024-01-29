// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract Lottery {
    address public manager;
	address public lastWinner;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function generateRandom() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, players)));
    }

    modifier validateSender() {
        require(msg.sender == manager, 'you have no permissions.');
        _;
    }

    function pickWinner() public validateSender {
        uint winnerIndex = generateRandom() % players.length;
        address payable winnerAddress = players[winnerIndex];

        winnerAddress.transfer(address(this).balance);

		lastWinner = winnerAddress;

        players = new address payable[](0);
    }

    function enter() public payable {
        require(msg.value > .01 ether, 'at least .01 ether required');
        players.push(payable(msg.sender));
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }
}