const hre = require("hardhat");
const contracts = require("../../frontend/utils/contracts.json");

async function main() {
    const address = contracts.crowdfunding.address;
    console.log("Checking contract at:", address);

    const Crowdfunding = await hre.ethers.getContractFactory("HalalCrowdfunding");
    const contract = Crowdfunding.attach(address);

    // Check project count
    const count = await contract.projectCount();
    console.log("Project Count:", count.toString());

    if (count > 0) {
        const project = await contract.projects(1);
        console.log("Project 1:");
        console.log("- ID:", project.id.toString());
        console.log("- Title:", project.title);
        console.log("- Verified:", project.verified);
    } else {
        console.log("No projects found!");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
