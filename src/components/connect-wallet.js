import * as Web3 from 'web3';

let address = "";

// updateInterval();

async function updateInterval() {
    var update = setInterval(async () => {
        if (address === undefined) {
            clearInterval(update);
            console.log("Wallet is disconnected");
            return null;
        }
        await updateVariables();
    }, 1000);
}

async function updateVariables() {
    await getAddress();
    console.log(address);
    // await getBalance();
    // await getExistance();
}

async function loadWallet() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access...
            return error;
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(this.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

async function getAddress() {
    address = await window.web3.eth.getAccounts();
    address = address[0];
    return address;
}

// async function getTab() {
//     usersRef.doc(account).get().then((doc) => {
//         userTab = doc.data().tab;
//     }).catch((error) => {
//         console.log("Error retrieving document:", error);
//     });
// }

export {loadWallet, getAddress};
