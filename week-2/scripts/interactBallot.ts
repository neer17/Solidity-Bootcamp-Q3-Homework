// Solidity Bootcamp Q3 2023
// Weekend Project 2 - GROUP 6

require('dotenv').config();
import { Transaction, TransactionReceipt, decodeBytes32String, ethers, toNumber } from "ethers";
import { Ballot__factory, Ballot } from "../typechain-types";

async function main() {
	// Change the url to your provider and set key on .env file
	const providerUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.PROVIDER_KEY}`;
	const provider = new ethers.JsonRpcProvider(providerUrl);

	// Change private key on .env file
	const wallet = new ethers.Wallet(process.env.MY_WALLET_PRIVATE_KEY ?? "", provider);
	const ballotFactory = new Ballot__factory(wallet);

	// Fetch arguments to run functions (not for the deploy function)
	const args = process.argv.slice(2);
	
	// Deploy the contract with Proposals passed as input arguments
	async function deployContract(propos: string[]) {
		const proposals = process.argv.slice(3);
		console.log("Deploying Ballot contract");
		console.log("Proposals: ");
		proposals.forEach((element, index) => {
			console.log(`Proposal N. ${index + 1}: ${element}`);
		});
		const ballotContract = await ballotFactory.deploy(
			proposals.map(ethers.encodeBytes32String));
		await ballotContract.waitForDeployment();
		const address = await ballotContract.getAddress();
		console.log(`Contract deployed at address ${address}`);
		for (let index = 0; index < proposals.length; index++) {
			const proposal = await ballotContract.proposals(index);
			const name = ethers.decodeBytes32String(proposal.name);
			console.log({ index, name, proposal });
		};
	};

	// Contract address, change to contract address
	const contractAddress = "0x6E08F69f938c9478eD6701A55F95959421519527";

	// Connect to deployed contract
	const ballotContract = ballotFactory.attach(contractAddress) as Ballot;

	// Filter wich function to be called
	if (args[0] == "deploy") {
		deployContract(args);
	} else if (args[0] == "giveRightToVote") {
		giveRightToVote(args[1]);
	} else if (args[0] == "delegate") {
		delegate(args[1]);
	} else if (args[0] == "vote") {
		vote(parseInt(args[1]));
	} else if (args[0] == "winningProposal") {
		winningProposal();
	} else if (args[0] == "winnerName") {
		winnerName();
	}

	// 'giveRightToVote(address to)' function
	async function giveRightToVote(addressTo: string) {
		//const giveTo = addressTo;
		const _giveRightToVote = await ballotContract.giveRightToVote(addressTo);
		console.log("Right to vote given to:", addressTo);
		console.log("Tx hash:", _giveRightToVote.hash);
	};

	// 'delegate' function
	async function delegate(addressTo: string) {
		//const delegateTo = "paste address here";
		const _delegate = await ballotContract.delegate(addressTo);
		console.log("Delegated voting right to:", addressTo);
		console.log("Tx hash:", _delegate.hash);
	};

	// 'vote' function, choose the index
	async function vote(proposalNumber: number) {
		//const proposalNumber = 0;
		const _vote = await ballotContract.vote(proposalNumber - 1);
		const votedProposal = await ballotContract.proposals(proposalNumber - 1)
		console.log(`Vote for proposal ${proposalNumber}:`, `"${decodeBytes32String(votedProposal.name)}"`, "submited");
		console.log("Tx hash:", _vote.hash);
	};

	// 'winningProposal' function
	async function winningProposal() {
		const _winningProposal = await ballotContract.winningProposal();
		console.log("The winning proposal number is:", toNumber(_winningProposal) + 1);
	};

	// 'winnerName' function
	async function winnerName() {
		const _winnerName = await ballotContract.winnerName();
		console.log("The winning proposal name is", `"${decodeBytes32String(_winnerName)}"`);
	};
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});