let gameRoomContractABI;
let gameRoomContractAddress;
let userBalance;
let userExistance;
let contractBalance;

let depositAmount;

load();

async function loadContract() {
	gameRoomContractABI = [
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
            "inputs": [],
            "name": "balance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
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
            "inputs": [],
            "name": "getBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
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
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "loss",
            "outputs": [],
            "stateMutability": "nonpayable",
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
            "name": "win",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdrawBalance",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ];
	gameRoomContractAddress = "0x09374a22101D4FBa52a817105Fcee18314808feA";
	return await new window.web3.eth.Contract(gameRoomContractABI, gameRoomContractAddress);
}

async function createUser () {
    await window.contract.methods.createUser().send({ from: account });
}

async function getBalance() {
    try {
        userBalance = await window.contract.methods.getBalance().call({ from: account });
    } catch (error) {
        console.log("User does not yet exist.");
    }
}

async function getExistance() {
    userExistance = await window.contract.methods.getExistance().call({ from: account });
}

function setDepositAmount(amount) {
    depositAmount = amount;
}

async function depositBalance() {
	await window.contract.methods.depositBalance().send({ from: account, value: web3.utils.toWei(depositAmount, "ether") });
}

async function withdrawBalance() {
	await window.contract.methods.withdrawBalance().send({ from: account });
}

async function win(amount) {
	await window.contract.methods.win(web3.utils.toWei(String(amount), "ether")).send({ from: account });
}

async function loss(amount) {
	await window.contract.methods.loss(web3.utils.toWei(String(amount *  -1), "ether")).send({ from: account });
}

async function balance() {
    contractBalance = await window.contract.methods.balance().call({ from: account });
	console.log(web3.utils.fromWei(contractBalance, "ether"));
}

// async function withdrawContract() {
// 	await window.contract.methods.withdrawContract().send({ from: account });
// }

async function load() {
	window.contract = await loadContract();
}