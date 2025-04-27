# Crowd.Fun

Supercharge your crowdfunding with memes. 

## Submission Details
a) Presentation Video: [https://www.loom.com/share/a7cfbe0dcc0a4dd191645fc9d3b3317c?sid=0daae535-e357-4303-8d89-93d6cd8ca74d](https://www.loom.com/share/a7cfbe0dcc0a4dd191645fc9d3b3317c?sid=9c66e2d4-f0bf-49e0-ad03-dc8c070156ea)

b) UI Screenshots
<img width="1679" alt="image" src="https://github.com/user-attachments/assets/2b4ff5da-8a1e-4a49-b79a-eac42af863a5" />
<img width="1662" alt="image" src="https://github.com/user-attachments/assets/ab5e3275-c7af-4ab5-b791-70af4bbe6d3a" />
<img width="1707" alt="image" src="https://github.com/user-attachments/assets/82b79c36-e1a7-46fa-b3cd-0d718959ab0b" />
<img width="1698" alt="image" src="https://github.com/user-attachments/assets/cb22a092-c0c8-4cc6-a8b7-699f5f129ce3" />

c) Smart contraction description

Contract code can be found in `/contracts` directory.

This CrowdFunding contract lets anyone send native WND tokens to a campaign until either the funding goal is met or the deadline passes. Each call to contribute() records the sender’s pledge, updates the total, and emits a Funded event; once the total reaches or exceeds the goal, it flips a goalReached flag and emits GoalReached. If the owner deployed the campaign and the goal is reached, they can call withdraw()—protected against reentrancy—to transfer the full balance to themselves, emitting OwnerWithdraw. If the deadline passes without meeting the goal, any contributor can call refund() to reclaim their exact pledge, again guarded by the ReentrancyGuard, and receive a Refund event. Helper views getBalance() and timeLeft() let users check the current balance and remaining campaign time.

d) Technical Demo
[https://www.loom.com/share/0aff3ccc674043a0a86ae38b37fb1607?sid=230523ba-8221-44b4-9a99-ff24a361f288](https://www.loom.com/share/0aff3ccc674043a0a86ae38b37fb1607?sid=230523ba-8221-44b4-9a99-ff24a361f288)

e) Block Explorer Link

https://assethub-westend.subscan.io/account/0x5Ea37Db0aF71c8Cd19B6D364bBc1170e0d79544f
