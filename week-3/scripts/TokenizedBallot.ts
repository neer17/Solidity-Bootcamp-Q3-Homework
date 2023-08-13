 //   Solidity Bootcamp Q3 2023   \\
//   Weekend Project 3 - GROUP 6   \\

require('dotenv').config();
import { decodeBytes32String, ethers, toNumber } from "ethers";
import { TokenizedBallot, TokenizedBallot__factory } from "../typechain-types";

async function main() {
	// Change the url to your provider and set key on .env file
	const providerUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.PROVIDER_KEY}`;
	const provider = new ethers.JsonRpcProvider(providerUrl);

	// Change private key on .env file
	const wallet = new ethers.Wallet(process.env.MY_WALLET_PRIVATE_KEY ?? "", provider);
	const tokenizedBallotFactory = new TokenizedBallot__factory(wallet);
	const walletAddress = await wallet.getAddress();

	// Fetch arguments to run functions 
	const args = process.argv.slice(2);

	// Address from deployed Token contract
	const tokenContract = "0x9805944Da4F69978dffc4c02eA924911D668d81a"; // Group 6 Token Contract

	// Block number (timestamp) to consider existing voting power
	const targetBlockNumber = 4081590;

	// Number of proposals
	const numberProposals = 3;

	// Deploy the contract with Proposals passed as input arguments (tokenContract and tragetBlockNumber are hardcoded in the script, check above variables)
	async function deployBallot(propos: string[]) {
		const proposals = process.argv.slice(3);
		console.log("Deploying TokenizedBallot contract");
		console.log("Proposals: ");
		proposals.forEach((element, index) => {
			console.log(`Proposal N. ${index + 1}: ${element}`);
		});
		const tokenizedBallotContract = await tokenizedBallotFactory.deploy(proposals.map(ethers.encodeBytes32String), tokenContract, targetBlockNumber);
		await tokenizedBallotContract.waitForDeployment();
		const address = await tokenizedBallotContract.getAddress();
		console.log(`Contract deployed at address ${address}`);
		for (let index = 0; index < proposals.length; index++) {
			const proposal = await tokenizedBallotContract.proposals(index);
			const name = ethers.decodeBytes32String(proposal.name);
			console.log({ index, name, proposal });
		};
	};

	// Contract address, change to contract address
	const tokenizedBallotAddress = "0x86194b8C24DB66Ef9ACFA70b4c2fc837F0684961"; // Group 6 TokenizedBallot Contract

	// Connect to deployed contract
	const tokenizedBallotContract = tokenizedBallotFactory.attach(tokenizedBallotAddress) as TokenizedBallot;

	// Filter wich function to be called
	if (args[0] == "deployBallot") {
		deployBallot(args);
	} else if (args[0] == "vote") {
		vote(parseInt(args[1]), ethers.parseUnits(args[2]));
	} else if (args[0] == "votingPower") {
		votingPower(args[1]);
	} else if (args[0] == "checkProposals") {
		checkProposals();
	} else if (args[0] == "winningProposal") {
		winningProposal();
	} else if (args[0] == "winnerName") {
		winnerName();
	}

	// 'vote' function (vote on proposal Number not index, and choose number of tokens)
	async function vote(proposalNumber: number,  amount: bigint) {
		const powerBefore = await tokenizedBallotContract.votingPower(walletAddress);
		const _vote = await tokenizedBallotContract.vote(proposalNumber - 1, amount);
		const votedProposal = await tokenizedBallotContract.proposals(proposalNumber - 1);
		const powerAfter = powerBefore - amount;
		console.log(`\nVote for proposal ${proposalNumber}:`, `"${decodeBytes32String(votedProposal.name)}"`, "submited...");
		console.log("Remaining voting power:", ethers.formatUnits(powerAfter));
		console.log("Tx hash:", _vote.hash, "\n");
	};

	// 'votingPower' function (check the voting power) 
	async function votingPower(addressFrom: string) {
		const votes = await tokenizedBallotContract.votingPower(addressFrom);
		console.log(`\nAccount ${addressFrom} has ${ethers.formatUnits(votes).toString()} units of voting power\n`);
	};

	// 'checkProposals' function, check proposals info (must manually set number of proposals at numberProposals variable)
	async function checkProposals() {
		console.log(`\nAvailable Proposals\n`);
		for (let index = 0; index < numberProposals; index++) {
			const proposal = await tokenizedBallotContract.proposals(index);
			const name = ethers.decodeBytes32String(proposal.name);
			const votes = ethers.formatUnits(proposal.voteCount);
			console.log(`Number: ${index + 1}\nName: ${name}\nVotes: ${votes}\n`);
		};
	};

	// 'winningProposal' function
	async function winningProposal() {
		const _winningProposal = await tokenizedBallotContract.winningProposal();
		console.log("\nThe winning proposal number is:", toNumber(_winningProposal) + 1, "\n");
	};

	// 'winnerName' function
	async function winnerName() {
		const _winnerName = await tokenizedBallotContract.winnerName();
		console.log("\nThe winning proposal name is", `"${decodeBytes32String(_winnerName)}"\n`);
	};
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});