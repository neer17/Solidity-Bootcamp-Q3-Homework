import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
require('dotenv').config();

const config: HardhatUserConfig = {
	defaultNetwork: "sepolia",
	networks: {
	  hardhat: {
	  },
	  sepolia: {
		url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.PROVIDER_KEY}`,
	  }
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY
	},
	solidity: {
		version: "0.8.19"
	},
	paths: { 
		tests: "tests" 
	},
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();
  
	for (const account of accounts) {
	  console.log(account.address);
	}
  });

export default config;
