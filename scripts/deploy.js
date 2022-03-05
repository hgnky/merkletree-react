// import { ethers } from "ethers";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await ethers.getContractFactory("MerkleContract");
    const token = await Token.deploy("My Golf", "GOLF", "0xd7fc1ff837fa9c83cb3fe4d72a03747bb55f62a6c54f79f7f033ceee873e1f46");

    console.log("Token address:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });