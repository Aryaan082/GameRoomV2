window.web3 = new Web3(window.ethereum);
let account = "";
let userTab;
let tabBalance;
let userStatus = "Create User";
let cursorType = "pointer";

updateInterval();

async function updateInterval() {
    var update = setInterval(async () => {
        if (account == undefined) {
            clearInterval(update);
            console.log("Wallet is disconnected");
            return null;
        }
        await updateVariables();
    }, 1000);
}

async function updateVariables() {
    await getCurrentAccount();
    await getBalance();
    await getExistance();
    console.log(account);
    updateInterface();
}

async function loadWallet() {
    await loadWeb3();
    await getCurrentAccount();
    updateInterval();
}

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
        } catch (error) {
            // User denied account access...
            console.log("Couldn't connect to wallet.");
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

async function getCurrentAccount() {
    let accounts = await window.web3.eth.getAccounts();
    accounts = accounts[0];
    account = accounts;
}

async function getTab() {
    usersRef.doc(account).get().then((doc) => {
        userTab = doc.data().tab;
    }).catch((error) => {
        console.log("Error retrieving document:", error);
    });
}

function updateInterface() {
    if (account == undefined) {
        let walletInfoNode = document.getElementById("walletInfo");
        while (walletInfoNode.firstChild) {
            walletInfoNode.removeChild(walletInfoNode.lastChild);
        }

        let walletButton = document.createElement("button");
        walletButton.classList.add("connectWallet");
        walletButton.onclick = function() {loadWallet()};
        walletInfoNode.append(walletButton);

        let walletStatus = document.createElement("div");
        walletStatus.innerHTML = "Connect Wallet";
        walletStatus.style.position = "absolute";
        walletStatus.style.top = "8px";
        walletStatus.style.right = "20px";
        walletButton.append(walletStatus);
    } else {
        if (userExistance == false) {
            let walletInfoNode = document.getElementById("walletInfo");
            while (walletInfoNode.firstChild) {
                walletInfoNode.removeChild(walletInfoNode.lastChild);
            }

            let newUserElement = document.createElement("div");
            newUserElement.classList.add("connectedWallet");
            newUserElement.classList.add("tooltip");
            newUserElement.style.cursor = "pointer";
            newUserElement.onclick = function() {
                createUser();
                usersRef.doc(account).set({
                    tab: 0
                });
                userStatus = "Loading...";
            };
            walletInfoNode.append(newUserElement);

            let statusElement = document.createElement("div");
            statusElement.classList.add("tooltiptext");
            statusElement.innerHTML = "Connected to: " + account.charAt(0) + account.charAt(1) + account.charAt(2) + account.charAt(3) + 
            account.charAt(4) + "..." + account.charAt(38) + account.charAt(39) + account.charAt(40) + account.charAt(41);
            statusElement.style.whiteSpace = "normal";
            newUserElement.append(statusElement);

            let createNewUser = document.createElement("div");
            createNewUser.innerHTML = userStatus;
            createNewUser.style.position = "absolute";
            createNewUser.style.top = "50%";
            createNewUser.style.left = "50%";
            createNewUser.style.transform = "translate(-50%, -50%)";
            newUserElement.append(createNewUser);
        } else {
            let walletInfoNode = document.getElementById("walletInfo");
            while (walletInfoNode.firstChild) {
                walletInfoNode.removeChild(walletInfoNode.lastChild);
            }

            let withdrawElement = document.createElement("div");
            withdrawElement.classList.add("withdraw");
            withdrawElement.style.cursor = "pointer";
            withdrawElement.onclick = function() {withdrawBalance()};
            walletInfoNode.append(withdrawElement);

            let withdrawLabel = document.createElement("div");
            withdrawLabel.innerHTML = "Withdraw";
            withdrawLabel.style.position = "absolute";
            withdrawLabel.style.top = "50%";
            withdrawLabel.style.left = "50%";
            withdrawLabel.style.transform = "translate(-85%, -50%)";
            withdrawElement.append(withdrawLabel);

            let depositElement = document.createElement("div");
            depositElement.classList.add("deposit");
            depositElement.style.cursor = "pointer";
            depositElement.onclick = function() {depositGUI()};
            walletInfoNode.append(depositElement);

            let depositLabel = document.createElement("div");
            depositLabel.innerHTML = "Deposit";        
            depositLabel.style.position = "absolute";
            depositLabel.style.top = "50%";
            depositLabel.style.left = "50%";
            depositLabel.style.transform = "translate(-100%, -50%)";
            depositElement.append(depositLabel);

            let tabElement = document.createElement("div");
            tabElement.classList.add("tab");
            walletInfoNode.append(tabElement);

            let tabLabel = document.createElement("div");
            tabLabel.onclick = function () {
                if (userTab > 0) {
                    win(userTab);
                    usersRef.doc(account).update({
                        tab: 0
                    });
                } else {
                    loss(userTab);
                    usersRef.doc(account).update({
                        tab: 0
                    });
                }
            };
            withdrawElement.onclick = function() {withdrawBalance()};
            getTab();
            tabLabel.innerHTML = "Settle " + userTab + " Ether";
            tabLabel.style.marginTop = "9px";
            tabElement.append(tabLabel);

            let walletElement = document.createElement("div");
            walletElement.classList.add("connectedWallet");
            walletElement.classList.add("tooltip");
            walletInfoNode.append(walletElement);
            
            let statusElement = document.createElement("div");
            statusElement.classList.add("tooltiptext");
            statusElement.innerHTML = "Connected to: " + account.charAt(0) + account.charAt(1) + account.charAt(2) + account.charAt(3) + 
            account.charAt(4) + "..." + account.charAt(38) + account.charAt(39) + account.charAt(40) + account.charAt(41);
            statusElement.style.whiteSpace = "normal";
            walletElement.append(statusElement);

            let balanceLabel = document.createElement("div");
            balanceLabel.innerHTML = "Balance:";
            balanceLabel.style.position = "absolute";
            balanceLabel.style.top = "50%";
            balanceLabel.style.left = "50%";
            balanceLabel.style.transform = "translate(-40%, -120%)";
            balanceLabel.style.fontSize = "10px";
            walletElement.append(balanceLabel);

            let balance = document.createElement("div");
            balance.innerHTML = web3.utils.fromWei(userBalance, "ether") + " Ether";
            balance.style.position = "absolute";
            balance.style.top = "50%";
            balance.style.left = "50%";
            balance.style.transform = "translate(-43%, -25%)";
            walletElement.append(balance);

            let connectCircle = document.createElement("div");
            connectCircle.style.position = "absolute";
            connectCircle.style.height = "10px";
            connectCircle.style.width = "10px";
            connectCircle.style.background = "#23d198";
            connectCircle.style.top = "50%";
            connectCircle.style.left = "50%";
            connectCircle.style.transform = "translate(-600%, -50%)";
            connectCircle.style.borderRadius = "50%";
            walletElement.append(connectCircle);
        }
    }
}