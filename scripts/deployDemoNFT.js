
const hre = require("hardhat");

async function main() {

  const NFTDemo = await hre.ethers.getContractFactory("NFTDemo");
  const nftDemo = await NFTDemo.deploy();

  await nftDemo.deployed();

  console.log("NFTDemo deployed to:", nftDemo.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
