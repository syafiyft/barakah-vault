const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("HalalCrowdfunding", function () {
    async function deployCrowdfundingFixture() {
        const [owner, otherAccount, contributor] = await ethers.getSigners();

        const DonationReceipt = await ethers.getContractFactory("DonationReceipt");
        const receiptToken = await DonationReceipt.deploy(owner.address);

        const HalalCrowdfunding = await ethers.getContractFactory("HalalCrowdfunding");
        const crowdfunding = await HalalCrowdfunding.deploy(receiptToken.target);

        // Transfer ownership of receiptToken to crowdfunding contract so it can mint
        await receiptToken.transferOwnership(crowdfunding.target);

        return { crowdfunding, receiptToken, owner, otherAccount, contributor };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { crowdfunding, owner } = await loadFixture(deployCrowdfundingFixture);
            expect(await crowdfunding.owner()).to.equal(owner.address);
        });

        it("Crowdfunding contract should own the Receipt contract", async function () {
            const { crowdfunding, receiptToken } = await loadFixture(deployCrowdfundingFixture);
            expect(await receiptToken.owner()).to.equal(crowdfunding.target);
        });
    });

    describe("Projects", function () {
        it("Should create a project", async function () {
            const { crowdfunding, otherAccount } = await loadFixture(deployCrowdfundingFixture);

            await expect(crowdfunding.connect(otherAccount).createProject(
                "Test Project",
                "Description",
                ethers.parseEther("10"),
                30
            )).to.emit(crowdfunding, "ProjectCreated")
                .withArgs(1, "Test Project", ethers.parseEther("10"), otherAccount.address);
        });

        it("Should verify a project", async function () {
            const { crowdfunding, owner, otherAccount } = await loadFixture(deployCrowdfundingFixture);

            await crowdfunding.connect(otherAccount).createProject("P1", "D1", 100, 30);

            await expect(crowdfunding.verifyProject(1))
                .to.emit(crowdfunding, "ProjectVerified")
                .withArgs(1);

            const project = await crowdfunding.projects(1);
            expect(project.verified).to.equal(true);
        });
    });

    describe("Contributions", function () {
        it("Should allow contribution to verified project and mint NFT", async function () {
            const { crowdfunding, receiptToken, contributor, owner } = await loadFixture(deployCrowdfundingFixture);

            // Create and Verify
            await crowdfunding.createProject("P1", "D1", ethers.parseEther("10"), 30);
            await crowdfunding.verifyProject(1);

            // Contribute
            await expect(crowdfunding.connect(contributor).contribute(1, "ipfs://metadata-uri", { value: ethers.parseEther("1") }))
                .to.emit(crowdfunding, "ContributionReceived")
                .withArgs(1, contributor.address, ethers.parseEther("1"));

            // Check Balance
            const project = await crowdfunding.projects(1);
            expect(project.raised).to.equal(ethers.parseEther("1"));

            // Check NFT
            expect(await receiptToken.balanceOf(contributor.address)).to.equal(1);
            expect(await receiptToken.tokenURI(0)).to.equal("ipfs://metadata-uri");
        });

        it("Should FAIL if project not verified", async function () {
            const { crowdfunding, contributor } = await loadFixture(deployCrowdfundingFixture);
            await crowdfunding.createProject("P1", "D1", ethers.parseEther("10"), 30);

            await expect(crowdfunding.connect(contributor).contribute(1, "uri", { value: ethers.parseEther("1") }))
                .to.be.revertedWith("Project not verified by Shariah Board");
        });
    });

    describe("Milestones", function () {
        it("Should release funds to creator", async function () {
            const { crowdfunding, owner, otherAccount, contributor } = await loadFixture(deployCrowdfundingFixture);

            // Setup: Created by otherAccount
            await crowdfunding.connect(otherAccount).createProject("P1", "D1", ethers.parseEther("10"), 30);
            await crowdfunding.verifyProject(1);

            // Contribute
            await crowdfunding.connect(contributor).contribute(1, "uri", { value: ethers.parseEther("5") });

            // Release
            const initialBalance = await ethers.provider.getBalance(otherAccount.address);

            await expect(crowdfunding.releaseMilestone(1, ethers.parseEther("2"), "Phase 1"))
                .to.emit(crowdfunding, "FundsReleased")
                .withArgs(1, ethers.parseEther("2"), "Phase 1");

            const finalBalance = await ethers.provider.getBalance(otherAccount.address);
            expect(finalBalance).to.equal(initialBalance + ethers.parseEther("2"));
        });
    });
});
