import * as Web3 from 'web3';


async function createUser(address) {
    await window.contract.methods.createUser().send({ from: address });
}

async function getBalance(address) {
    try {
        return await window.contract.methods.getBalance().call({ from: address });
    } catch (error) {
        console.log("User does not yet exist.");
    }
}

async function getExistance(address) {
    return await window.contract.methods.getExistance().call({ from: address });
}

async function depositBalance(address, depositAmount) {
	await window.contract.methods.depositBalance().send({ from: address, value: Web3.utils.toWei(depositAmount, "ether") });
}

async function withdrawBalance(address) {
	await window.contract.methods.withdrawBalance().send({ from: address });
}

async function win(address, winAmount) {
	await window.contract.methods.win(Web3.utils.toWei(String(winAmount), "ether")).send({ from: address });
}

async function loss(address, lossAmount) {
	await window.contract.methods.loss(Web3.utils.toWei(String(lossAmount *  -1), "ether")).send({ from: address });
}

async function balance(address) {
    return await window.contract.methods.balance().call({ from: address });
}

// async function withdrawContract() {
// 	await window.contract.methods.withdrawContract().send({ from: account });
// }

export {createUser, getBalance, getExistance, depositBalance, withdrawBalance, win, loss, balance};