const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ArtNFT = await hre.ethers.getContractFactory("ArtNFT");
  const artNFT = await ArtNFT.deploy();

  await artNFT.waitForDeployment(); // 🔥 Required to wait for deployment

  console.log("ArtNFT deployed to:", await artNFT.getAddress()); // ✅ Use getAddress()
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
