// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./DonationReceipt.sol";

contract HalalCrowdfunding is Ownable, ReentrancyGuard {
    
    struct Project {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 raised;
        uint256 deadline;
        bool verified;
        bool completed;
        bool cancelled;
        uint256 fundsReleased;
    }

    uint256 public projectCount;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    
    DonationReceipt public receiptContract;

    event ProjectCreated(uint256 indexed id, string title, uint256 goal, address creator);
    event ContributionReceived(uint256 indexed projectId, address indexed contributor, uint256 amount);
    event ProjectVerified(uint256 indexed projectId);
    event FundsReleased(uint256 indexed projectId, uint256 amount, string milestone);
    event ProjectCancelled(uint256 indexed projectId);
    event RefundIssued(uint256 indexed projectId, address indexed contributor, uint256 amount);

    constructor(address _receiptContractAddress) Ownable(msg.sender) {
        receiptContract = DonationReceipt(_receiptContractAddress);
    }

    function createProject(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays
    ) external {
        projectCount++;
        projects[projectCount] = Project({
            id: projectCount,
            creator: msg.sender,
            title: _title,
            description: _description,
            goal: _goal,
            raised: 0,
            deadline: block.timestamp + (_durationInDays * 1 days),
            verified: false,
            completed: false,
            cancelled: false,
            fundsReleased: 0
        });

        emit ProjectCreated(projectCount, _title, _goal, msg.sender);
    }

    function verifyProject(uint256 _projectId) external onlyOwner {
        require(projects[_projectId].id != 0, "Project does not exist");
        projects[_projectId].verified = true;
        emit ProjectVerified(_projectId);
    }

    function contribute(uint256 _projectId, string memory _tokenURI) external payable nonReentrant {
        Project storage project = projects[_projectId];
        require(project.id != 0, "Project does not exist");
        require(block.timestamp < project.deadline, "Project deadline passed");
        require(!project.cancelled, "Project cancelled");
        require(!project.completed, "Project completed");
        // For MVP, we allow contributing even if not verified yet, but funds locked. 
        // Or maybe strict require(project.verified) ? Let's stick to verified for trust.
        require(project.verified, "Project not verified by Shariah Board");

        project.raised += msg.value;
        contributions[_projectId][msg.sender] += msg.value;

        // Mint NFT Receipt
        receiptContract.safeMint(msg.sender, _tokenURI);

        emit ContributionReceived(_projectId, msg.sender, msg.value);
    }

    function releaseMilestone(uint256 _projectId, uint256 _amount, string memory _milestoneDescription) external onlyOwner nonReentrant {
        Project storage project = projects[_projectId];
        require(project.id != 0, "Project does not exist");
        require(project.verified, "Project not verified");
        require(!project.cancelled, "Project cancelled");
        require(project.raised >= project.fundsReleased + _amount, "Insufficient funds raised");

        project.fundsReleased += _amount;
        payable(project.creator).transfer(_amount);

        emit FundsReleased(_projectId, _amount, _milestoneDescription);
    }

    function cancelProject(uint256 _projectId) external onlyOwner {
        Project storage project = projects[_projectId];
        require(!project.completed, "Project already completed");
        require(!project.cancelled, "Project already cancelled");
        
        project.cancelled = true;
        emit ProjectCancelled(_projectId);
    }

    function requestRefund(uint256 _projectId) external nonReentrant {
        Project storage project = projects[_projectId];
        require(project.cancelled || (block.timestamp > project.deadline && project.raised < project.goal), "Refund not available");
        
        uint256 amount = contributions[_projectId][msg.sender];
        require(amount > 0, "No contribution found");

        contributions[_projectId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit RefundIssued(_projectId, msg.sender, amount);
    }
}
