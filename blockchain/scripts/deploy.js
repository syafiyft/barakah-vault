const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy DonationReceipt
    const DonationReceipt = await hre.ethers.getContractFactory("DonationReceipt");
    const receiptToken = await DonationReceipt.deploy(deployer.address);
    await receiptToken.waitForDeployment();
    console.log("DonationReceipt deployed to:", receiptToken.target);

    // Deploy HalalCrowdfunding
    const HalalCrowdfunding = await hre.ethers.getContractFactory("HalalCrowdfunding");
    const crowdfunding = await HalalCrowdfunding.deploy(receiptToken.target);
    await crowdfunding.waitForDeployment();
    console.log("HalalCrowdfunding deployed to:", crowdfunding.target);

    // Transfer ownership of Receipt to Crowdfunding
    await receiptToken.transferOwnership(crowdfunding.target);
    console.log("DonationReceipt ownership transferred to Crowdfunding contract");

    // Seed initial project
    const tx = await crowdfunding.createProject(
        "Build Community Masjid in Kelantan",
        "A new masjid to serve 5,000+ Muslims in Kampung Baru.",
        hre.ethers.parseEther("500000"), // 500,000 ETH goal (high for demo but ok)
        45 // 45 days duration
    );
    await tx.wait();
    console.log("Seeded Project 1");

    // Verify it
    const verifyTx = await crowdfunding.verifyProject(1);
    await verifyTx.wait();
    console.log("Verified Project 1");

    // Seed some data? Optional.
    // Verify ownership transfer
    console.log("Owner of Receipt Token is:", await receiptToken.owner());

    // Save frontend files
    const fs = require("fs");
    const path = require("path");
    const contractsDir = path.join(__dirname, "../../frontend/utils");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    const contractsData = {
        receipt: {
            address: receiptToken.target,
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/DonationReceipt.sol/DonationReceipt.json"))).abi
        },
        crowdfunding: {
            address: crowdfunding.target,
            abi: JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/HalalCrowdfunding.sol/HalalCrowdfunding.json"))).abi
        }
    };

    fs.writeFileSync(
        path.join(contractsDir, "contracts.json"),
        JSON.stringify(contractsData, null, 2)
    );
    console.log("Contracts exported to frontend/utils/contracts.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
