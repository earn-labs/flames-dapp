import * as hre from "hardhat";
import {ethers} from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

// run this script with hardhat: npx hardhat run ./scripts/testnet/verifyFlames.ts --network ETH_GOERLI
const TOKEN_ADDRESS = "0xb6347F2A99CB1a431729e9D4F7e946f58E7C35C7";

const constructorArguments = [process.env.OWNER_ADDRESS_TESTNET, process.env.FEE_ADDRESS_TESTNET, TOKEN_ADDRESS];
const contractAddress = "0x8617EAfF9B93b9F6E94d4c63FE5B314d8724AF42";

async function main() {

    // verify contract
    console.log("Verifying contract on Etherscan...");
    if (constructorArguments != null) {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: constructorArguments,
            contract: "contracts/Flames.sol:Flames"
        });
    } else {
        await hre.run("verify:verify", {
            address: contractAddress,
            contract: "contracts/Flames.sol:Flames"
        });
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});