const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Get args from CLI
const [,, recipient, imageUrl] = process.argv;

if (!recipient || !imageUrl) {
  console.error("❌ Usage: node mint.js <recipient> <image-url>");
  process.exit(1);
}

console.log(`🚀 Minting NFT to ${recipient} with image: ${imageUrl}...`);

async function main() {
  // Hardhat local network provider
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Get signer (deployer account from Hardhat)
  const signer = await provider.getSigner(0);

  // Load contract ABI and address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update this with actual deployed address
  const contractAbi = JSON.parse(fs.readFileSync(path.join(__dirname, "../artifacts/contracts/ArtNFT.sol/ArtNFT.json"))).abi;

  // Connect to contract
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  // Call mintNFT function
  const tx = await contract.mintNFT(recipient, imageUrl);
  const receipt = await tx.wait();

  // Extract token ID from the Minted event
  const event = receipt.logs
    .map(log => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find(e => e && e.name === "Minted");

  if (event) {
    const tokenId = event.args.tokenId.toString();
    console.log(`✅ Minted successfully! Token ID: ${tokenId}`);
  } else {
    console.log("✅ Minted, but token ID not found in logs.");
  }
}

main().catch(err => {
  console.error("❌ Minting failed:", err.message || err);
});
