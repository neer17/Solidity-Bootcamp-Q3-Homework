# Group 6 - Weekend Project 3

This week’s project involved deploying and interacting with a Tokenized Ballot contract (TokenizedBallot.sol) and the corresponding Token contract (ERC20Votes.sol) used in the
Ballot. To perform the interactions, we had to write scripts (typescript) that would allow the group to interact with the contracts, deploying, minting tokens, transferring, delegating voting power, voting, and querying info/results.
###
Instead of breaking each interaction (function call) into a separate script file we opted to only have one file, for each contract, with all the functions and have a conditional statement to ensure that each function (including the deploy function) could be called from the terminal with arguments if needed.
###
Unlike what happened with the simple Ballot in the previous Weekend Project 2 where each account simply could or could not vote on one proposal, this Tokenized Ballot considers that the voting power is equivalent to the number of Tokens held by the account and delegated to itself before voting. This way also allows the voter to spread the voting power between the different proposals as desired.
###
First step was to deploy the Token contract and distribute tokens to the various individual accounts, after which some transfers and delegations followed. When everything was set, and at a determined block number, the Tokenized Ballot contract was deployed, and voting begun.
