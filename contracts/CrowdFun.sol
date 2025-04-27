// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CrowdFunding is ReentrancyGuard {
    // Address of the project owner
    address public owner;
    // Funding goal in wei
    uint256 public goal;
    // Unix timestamp for deadline
    uint256 public deadline;
    // Total amount contributed
    uint256 public totalContributed;
    // Track individual contributions
    mapping(address => uint256) public contributions;
    // Flags
    bool public goalReached;
    bool public fundsWithdrawn;

    // Events
    event Funded(address indexed contributor, uint256 amount);
    event GoalReached(uint256 totalAmount);
    event OwnerWithdraw(address indexed owner, uint256 amount);
    event Refund(address indexed contributor, uint256 amount);

    constructor(uint256 _goal, uint256 _durationSeconds) {
        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + _durationSeconds;
    }

    // Contribute native token (WND) to the campaign
    function contribute() external payable nonReentrant {
        require(block.timestamp < deadline, "Deadline passed");
        require(msg.value > 0, "Must send tokens");

        contributions[msg.sender] += msg.value;
        totalContributed += msg.value;
        emit Funded(msg.sender, msg.value);

        if (totalContributed >= goal && !goalReached) {
            goalReached = true;
            emit GoalReached(totalContributed);
        }
    }

    // Owner withdraws funds if goal reached
    function withdraw() external nonReentrant {
        require(msg.sender == owner, "Not owner");
        require(goalReached, "Goal not reached");
        require(!fundsWithdrawn, "Already withdrawn");

        fundsWithdrawn = true;
        uint256 amount = address(this).balance;
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Withdraw failed");
        emit OwnerWithdraw(owner, amount);
    }

    // Contributors claim refund if goal not met by deadline
    function refund() external nonReentrant {
        require(block.timestamp >= deadline, "Deadline not passed");
        require(!goalReached, "Goal was reached");

        uint256 contributed = contributions[msg.sender];
        require(contributed > 0, "No contributions");

        contributions[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: contributed}("");
        require(success, "Refund failed");
        emit Refund(msg.sender, contributed);
    }

    // View helper functions
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function timeLeft() external view returns (uint256) {
        return block.timestamp >= deadline ? 0 : deadline - block.timestamp;
    }
}
