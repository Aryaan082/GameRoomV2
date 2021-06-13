import * as Web3 from 'web3';

let gameRoomContractABI;
let gameRoomContractAddress;

async function loadContract() {
	gameRoomContractABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "changeOwner",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "createUser",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "depositBalance",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "oldOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnerSet",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "internalType": "int256",
                    "name": "_tab",
                    "type": "int256"
                }
            ],
            "name": "withdrawBalance",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "withdrawContract",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "balance",
            "outputs": [
                {
                    "internalType": "int256",
                    "name": "",
                    "type": "int256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getBalance",
            "outputs": [
                {
                    "internalType": "int256",
                    "name": "",
                    "type": "int256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getExistance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getOwner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
	gameRoomContractAddress = "0xd84b545dea8A2d56dFF2208f4D932d92CbCD9Ec2";
	window.contract = await new window.web3.eth.Contract(gameRoomContractABI, gameRoomContractAddress);
}

async function createUser(address) {
    await window.contract.methods.createUser().send({ from: address });
}

async function getBalance(address) {
    try {
        return await window.contract.methods.getBalance().call({ from: address });
    } catch (error) {
        return error;
    }
}

async function getExistance(address) {
    return await window.contract.methods.getExistance().call({ from: address });
}

async function depositBalance(address, depositAmount) {
	await window.contract.methods.depositBalance().send({ from: address, value: Web3.utils.toWei(depositAmount, "ether") });
}

async function withdrawBalance(address, withdrawAmount, tab) {
	await window.contract.methods.withdrawBalance(Web3.utils.toWei(withdrawAmount, "ether"), Web3.utils.toWei(tab, "ether")).send({ from: address });
}

async function getLiquidity(address) {
    return await window.contract.methods.balance().call({ from: address });
}

// async function withdrawContract() {
// 	await window.contract.methods.withdrawContract().send({ from: account });
// }

export {loadContract, createUser, getBalance, getExistance, depositBalance, withdrawBalance, getLiquidity};