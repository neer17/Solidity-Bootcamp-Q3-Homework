require('dotenv').config();
import { Transaction, TransactionReceipt, decodeBytes32String, ethers } from "ethers";
import { Ballot__factory, Ballot } from "../typechain-types";

async function main() {
	
	// Change the url to your provider and set key on .env file
	const providerUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.PROVIDER_KEY}`;
	const provider = new ethers.JsonRpcProvider(providerUrl);
	
	// Change private key on .env file
	const wallet = new ethers.Wallet(process.env.MY_WALLET_PRIVATE_KEY ?? "", provider);
	const ballotFactory = new Ballot__factory(wallet);

	// Deploy the contract with Proposals passed as input arguments
/* 	const proposals = process.argv.slice(2);
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
	} */

	// Contract address, change to contract address
	const contractAddress = "0xac00780fd30973C7216EE4F5ea23139f9C487D91";

	// Connect to deployed contract
	const ballotContract = ballotFactory.attach(contractAddress) as Ballot;
	
	// 'giveRightToVote(address to)' function
	const giveTo = "paste address here";
	const _giveRightToVote = await ballotContract.giveRightToVote(giveTo);
	console.log("Right to vote given to:", giveTo);
	console.log("Tx hash:", _giveRightToVote.hash);

	// 'delegate' function
	const delegateTo = "paste address here";
	const _delegate = await ballotContract.delegate(delegateTo);
	console.log("Delegated voting right to:", delegateTo);
	console.log("Tx hash:", _delegate.hash);

	// 'vote' function
	const proposalNumber = 0; // Here we choose the index
	const _vote = await ballotContract.vote(proposalNumber - 1); // +1 so we can see the number and not the index
	const votedProposal = await ballotContract.proposals(proposalNumber)
	console.log(`Vote for proposal ${proposalNumber}:`, `"${decodeBytes32String(votedProposal.name)}"`, "submited");
	console.log("Tx hash:", _vote.hash);

	// 'winningProposal' function
	const _winningProposal = await ballotContract.winningProposal();
	console.log("The winning proposal number is:", _winningProposal);

	// 'winnerName' function
	const _winnerName = await ballotContract.winnerName();
	console.log("The winning proposal name is", decodeBytes32String(_winnerName));
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});