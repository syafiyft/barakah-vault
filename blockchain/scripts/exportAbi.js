const fs = require("fs");
const path = require("path");

const RECEIPT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CROWDFUNDING_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function main() {
    const receiptArtifact = require("../artifacts/contracts/DonationReceipt.sol/DonationReceipt.json");
    const crowdfundingArtifact = require("../artifacts/contracts/HalalCrowdfunding.sol/HalalCrowdfunding.json");

    const contracts = {
        receipt: {
            address: RECEIPT_ADDRESS,
            abi: receiptArtifact.abi
        },
        crowdfunding: {
            address: CROWDFUNDING_ADDRESS,
            abi: crowdfundingArtifact.abi
        }
    };

    const outputPath = path.resolve(__dirname, "../../frontend/utils/contracts.json");

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(contracts, null, 2));
    console.log(`Contracts exported to ${outputPath}`);
}

main();
