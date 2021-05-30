import * as React from 'react';
import * as Web3 from 'web3';
import * as CoinGecko from 'coingecko-api';
import {Navbar, Button, Form, Col, InputGroup, FormControl, Modal, Tabs, Tab, Overlay, Popover} from 'react-bootstrap';
import {ToastContainer, toast} from 'react-toastify';
import PuffLoader from 'react-spinners/PuffLoader';
import {SocialIcon} from 'react-social-icons';
import {loadContract, createUser, getBalance, getExistance, depositBalance, withdrawBalance, getLiquidity} from '../components/connect-smart-contracts';
import {RenderCards, newGame, hit, stand, winnerMessage} from '../components/blackjack/blackjack-engine';
import {db} from '../firebase';
import ethLogo from '../components/eth-app-logo.png';
import ethIcon from '../components/eth.png';
import bugIcon from '../components/bug.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../components/style.css';

const CoinGeckoClient = new CoinGecko();
let ethPrice;

async function getEthPrice() {
    await CoinGeckoClient.simple.price({ids: 'ethereum'}).then(async (eth) => {
        ethPrice = Number(eth.data.ethereum.usd);
        return ethPrice;
    });
}

getEthPrice();

function WalletForm({type, walletBalance, siteBalance, tab, liquidity, onSubmit, popover, setPopover, target, setTarget}) {
    const [amount, setAmount] = React.useState('');

    function handleChange(event) {
        setAmount(event.target.value);
    }

    function maxWithdraw(event) {
        if (Number(siteBalance) + Number(tab) <= Number(liquidity)) {
            setAmount((Number(siteBalance) + Number(tab)).toFixed(4));
        } else {
            setPopover('Not enough liquidity.');
            setTarget(event.target);
            setTimeout(() => setPopover(undefined), 3000);
            console.log('Unable to carry out transaction. Not enough liquidity.');
            setAmount(Number(liquidity).toFixed(4));
        }
    }

    return (
        <Modal.Body>
            <p>Wallet Balance: <b>{Number(walletBalance)} ETH</b></p>
            <p>OpenGames Balance: <b>{Number(siteBalance)} ETH</b></p>
            <p>Current Tab: <b>{Math.abs(Number(tab))} ETH</b></p>
            <p>Current Liquidity: <b>{Number(liquidity)} ETH</b></p>
            <Form onSubmit={onSubmit}>
                <InputGroup>
                    <FormControl style={{
                        border: '1px solid #f1f1f4', 
                        background: '#f1f1f4'
                    }} placeholder={type} value={amount} onChange={handleChange} />
                    <InputGroup.Append>
                        {type === 'Withdraw' ? (
                            <>
                                <Button variant='light' onClick={maxWithdraw}>Max</Button>
                                <InputGroup.Text style={{border: '0'}}>ETH</InputGroup.Text>
                            </>
                        ) : (
                            <InputGroup.Text style={{border: '0'}}>ETH</InputGroup.Text>
                        )}
                    </InputGroup.Append>
                </InputGroup>
                <div style={{paddingTop: '15px'}}>
                    <Button variant='primary' type="submit" block>{type}</Button>
                    <Overlay show={Boolean(popover)} target={target} placement="top">
                        <Popover id="popover-contained">
                            <Popover.Content>
                                {popover}
                            </Popover.Content>
                        </Popover>
                    </Overlay>
                </div>
            </Form>
        </Modal.Body>
    );
}

function WalletModal({address, show, onHide, walletBalance, siteBalance, tab, liquidity, setTab, onClick}) {
    const [popover, setPopover] = React.useState(false);
    const [target, setTarget] = React.useState(null);

    function handleSubmitDeposit(event) {
        event.preventDefault();
        var regExp = /[a-zA-Z]/g;
        var depositAmount = event.target.elements[0].value;
        if (regExp.test(depositAmount)) {
            setPopover('Input error! Try again with an available value.');
            setTarget(event.target);
            setTimeout(() => setPopover(undefined), 3000);
            console.log('Input is not an available value.');
        } else {
            setPopover(undefined);
            depositBalance(address, depositAmount);
        }
    }

    function handleSubmitWithdraw(event) {
        event.preventDefault();
        var regExp = /[a-zA-Z]/g;
        var withdrawAmount = event.target.elements[0].value;
        var tabPlaceholder;
        if (regExp.test(withdrawAmount)) {
            setPopover('Input error! Try again with an available value.');
            setTarget(event.target);
            setTimeout(() => setPopover(undefined), 3000);
            console.log('Input is not an available value.');
        } else {
            if (Number(withdrawAmount) > Number(tab) + Number(siteBalance)) {
                setPopover('You can\'t withdraw more than you own.');
                setTarget(event.target);
                setTimeout(() => setPopover(undefined), 3000);
            } else {
                setPopover(undefined);
                withdrawBalance(address, withdrawAmount, String(tab))
                .then(() => {
                    tabPlaceholder = (Number(withdrawAmount) > Number(tab) ? 0 : Number(tab) - Number(withdrawAmount));
                    setTab(tabPlaceholder.toFixed(4));
                    db.collection('users').doc(address).update({
                        tab: tabPlaceholder.toFixed(4)
                    });
                });
            }
            
        }
    }

    return (
        <Modal show={show} onHide={onHide} size='md' centered>
            <Modal.Header closeButton>
                <Modal.Title>Wallet Functions</Modal.Title>
            </Modal.Header>
            <Tabs style={{paddingTop: '10px', paddingLeft: '10px'}} defaultActiveKey="deposit">
                <Tab eventKey="deposit" title="Deposit">
                    <WalletForm type='Deposit' walletBalance={walletBalance} siteBalance={siteBalance} tab={tab} liquidity={liquidity} setTab={setTab} popover={popover} setPopover={setPopover} target={target} setTarget={setTarget} onSubmit={handleSubmitDeposit} />
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                    <WalletForm type='Withdraw' walletBalance={walletBalance} siteBalance={siteBalance} tab={tab} liquidity={liquidity} setTab={setTab} popover={popover} setPopover={setPopover} target={target} setTarget={setTarget} onSubmit={handleSubmitWithdraw} />
                </Tab>
            </Tabs>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClick}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function BugReportModal({show, onHide, onClick}) {
    return (
        <Modal show={show} onHide={onHide} size='md' centered>
            <Modal.Header closeButton>
                <Modal.Title>Report Bug</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    If you would like to report a bug, join our Discord server to share your thoughts and help develop OpenGames! Thanks.
                </p>
                <a style={{paddingLeft: '10px'}} href='https://discord.gg/58bHRuCc7n' target='_blank'>
                    <SocialIcon network='discord'></SocialIcon>
                </a> 
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClick}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function Main() {
    const [siteBalanceEth, setSiteBalanceEth] = React.useState(0);
    const [siteBalanceUsd, setSiteBalanceUsd] = React.useState(0);
    const [walletBalance, setWalletBalance] = React.useState(0);
    const [tab, setTab] = React.useState(0);
    const [account, setAccount] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);
    const [walletModal, setWalletModal] = React.useState(false);
    const [connected, setConnected] = React.useState(false);
    const [liquidity, setLiquidity] = React.useState(null);
    const [exists, setExists] = React.useState(true);
    const [isLoadingUser, setLoadingUser] = React.useState(false);
    const [bugModal, setBugModal] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    const handleCloseBugModal = () => setBugModal(false);
    const handleShowBugModal = () => setBugModal(true);

    const handleCloseWalletModal = () => setWalletModal(false);
    const handleShowWalletModal = () => setWalletModal(true);
    
    var address;
    var balance = 0;
    var update;
    var poolAmount;
    var userTab;
    var existance;
    window.web3 = new Web3(window.ethereum);
    getTab();
    updateVariables();
    updateInterval();
    loadContract();

    React.useEffect(() => {
        setMounted(false);
        setTimeout(() => {
            setMounted(true);
        }, 3000)
    }, []);
    
    async function updateInterval() {
        update = setInterval(async () => {
            if (address === undefined) {
                console.log("Wallet is disconnected");
                setConnected(false);
                clearInterval(update);
                setLoading(false);
            } else {
                setConnected(true);
                updateVariables();
            }
        }, 3000);
    }
    
    async function updateVariables() {
        window.web3.eth.getAccounts().then(addresses => {
            address = addresses[0];
            setAccount(address);
            window.web3.eth.getBalance(address).then(personalBalance => {
                balance = Number(Web3.utils.fromWei(personalBalance, "ether")).toFixed(4);
                setWalletBalance(balance);
            }).catch(() => {
                return;
            });
            getExistance(address).then(accountExists => {
                existance = accountExists;
                setExists(existance);
            }).catch(() => {
                console.log('hi');
            });
            getBalance(address).then(smartContractBalance => {
                balance = Number(Web3.utils.fromWei(smartContractBalance, "ether")).toFixed(4);
                setSiteBalanceEth(balance);
                balance = Number(Web3.utils.fromWei(smartContractBalance, "ether") * ethPrice).toFixed(4)
                setSiteBalanceUsd(balance);
            }).catch(() => {
                return;
            });
            getLiquidity(address).then(pool => {
                poolAmount = Number(Web3.utils.fromWei(pool, "ether")).toFixed(4);
                setLiquidity(poolAmount);
            }).catch(() => {
                return;
            });
        }).catch(() => {
            clearInterval(update);
            setConnected(false);
        });
    }
    
    async function loadWallet() {
        setLoading(true);
        await loadWeb3();
        window.web3.eth.getAccounts().then(addresses => {
            address = addresses[0];
            setAccount(address);
            window.web3.eth.getBalance(address).then(addressBalance => {
                balance = Number(Web3.utils.fromWei(addressBalance, "ether")).toFixed(4);
                setWalletBalance(balance);
            });
        })
        .catch(() => {
            clearInterval(update);
            setConnected(false);
        });
    }

    async function getTab() {
        window.web3.eth.getAccounts().then(addresses => {
            address = addresses[0];
            setAccount(address);
            db.collection('users').doc(account).get().then(doc => {
                userTab = doc.data().tab;
                setTab(Number(userTab).toFixed(4));
            }).catch((error) => {
                console.log("Error retrieving document:", error);
            });
        }).catch(() => {
            clearInterval(update);
            setConnected(false);
        });
    }

    async function loadWeb3() {
        // Check if browser is running Metamask
        if (window.ethereum) {
            try {
                // Request account access if needed
                await window.ethereum.enable();
                setConnected(true);
            } catch (error) {
                // User denied account access...
                setLoading(false);
                return error;
            }
        }
    }

    function createAccountUser() {
        setLoadingUser(true);
        createUser(account)
        .then(() => {
            setExists(true);
            db.collection('users').doc(account).set({
                tab: 0
            });
        })
        .catch(() => {
            setLoadingUser(false);
            setExists(false);
        });
    }

    return (
        <div>
            {!mounted ? (
                <div style={{
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100vh'
                }}>
                    <PuffLoader color={'#ffffff'} loading={!mounted} size={80} />
                </div>
            ) : (
                <>
                    <Navbar style={{
                        backgroundColor: '#002c6b', 
                        width: '100%',
                        paddingLeft: '10px',
                        paddingRight: '10px'
                    }} expand='true' variant="dark">
                        <Navbar.Brand href='.'>
                            <img src={ethLogo} alt='Logo' width='40' height='40'></img>
                            &nbsp;
                            <h1 style={{
                                fontSize: '25px',
                                fontWeight: 'bold',
                                display: 'flex',
                                paddingLeft: '50px',
                                marginTop: '-35px'
                            }}>
                                OpenGames
                            </h1>
                        </Navbar.Brand>
                        {connected ? (
                            exists ? (
                                <div>
                                    <div style={{
                                        backgroundColor: '#082857',
                                        borderRadius: '5px',
                                        padding: '7px 8px',
                                        fontSize: '16px',
                                        color: '#ffffff',
                                        display: 'inline-block',
                                    }}>
                                        <img style={{marginTop: '-2px'}} src={ethIcon} alt='Eth:' width='25px' height='25px' />
                                        &nbsp;
                                        {`$${(Number(siteBalanceUsd) + Number(tab)*ethPrice).toFixed(4)}`}
                                    </div>
                                    <Button variant='success' onClick={handleShowWalletModal}>
                                        Wallet
                                    </Button>
                                </div>
                            ) : (
                                null
                            )
                        ) : (
                            null
                        )}

                        <div>
                            {connected ? (
                                exists ? (
                                    <div style={{
                                        color: '#ffffff', 
                                        fontSize: '18px'
                                    }}>
                                        {account ? 'Logged In: ' + account.charAt(0) + account.charAt(1) + account.charAt(2) + account.charAt(3) + account.charAt(4) + account.charAt(5) + '...' + account.charAt(38) + account.charAt(39) + account.charAt(40) + account.charAt(41) : null}
                                    </div>
                                ) : (
                                    <Button className='red-pulse' variant="danger" onClick={createAccountUser} disabled={isLoadingUser}>{isLoadingUser ? 'Loading...' : 'Create User'}</Button>
                                )
                            ) : (
                                <Button variant="primary" onClick={loadWallet} disabled={isLoading}>{isLoading ? 'Loading...' : 'Connect Wallet'}</Button>
                            )}
                        </div>
                    </Navbar>
                    <Button style={{
                        width: '40px', 
                        height: '40px',
                        position: 'absolute',
                        left: '100%',
                        top: '100%',
                        transform: 'translate(-100%, -100%)'
                    }} variant='light' onClick={handleShowBugModal}>
                        <img style={{
                            height: '30px',
                            width: '30px',
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }} src={bugIcon} alt='bug'></img>
                    </Button>
                    <BlackjackGame address={account} tab={tab} setTab={setTab} siteBalance={siteBalanceEth} />
                    <BugReportModal show={bugModal} onHide={handleCloseBugModal} onClick={handleCloseBugModal} />
                    <WalletModal address={account} liquidity={liquidity} show={walletModal} onHide={handleCloseWalletModal} walletBalance={walletBalance} siteBalance={siteBalanceEth} setSiteBalance={setSiteBalanceEth} tab={tab} setTab={setTab} onClick={handleCloseWalletModal} />
                </>
            )}
        </div>
    );
}

function BlackjackGame({address, tab, setTab, siteBalance}) {
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [standStatus, setStandStatus] = React.useState(false);
    const [initialize, setInitialize] = React.useState(true);
    const [popover, setPopover] = React.useState(false);
    const [target, setTarget] = React.useState(null);
    const [state, setState] = React.useState();
    const [bet, setBet] = React.useState(0);

    var betAmount;

    const handleInitialize = () => {
        setInitialize(false);
        startGame(0);
    };

    function startGame(event) {
        setPopover(undefined);
        var regExp = /[a-zA-Z]/g;
        
        if (event === 0) {
            betAmount = 0;
        } else {
            event.preventDefault();
            betAmount = event.target[2].value;
            setBet(betAmount);
        }
        if (regExp.test(betAmount)) {
            setPopover('Input error! Try again with an available value.');
            setTimeout(() => setPopover(undefined), 3000);
            setTarget(event.target);
            console.log('Input is not an available value.');
        } else {
            if (Number(siteBalance) + Number(tab) - Number(betAmount)/ethPrice >= 0) {
                setButtonDisabled(false);
                setStandStatus(false);
                setTab((Number(tab) - (Number(betAmount)/ethPrice)).toFixed(4));
                db.collection('users').doc(address).update({
                    tab: (Number(tab) - (Number(betAmount)/ethPrice)).toFixed(4)
                });
                newGame();
            } else {
                setPopover('Unable to bet. Deposit more to play.');
                setTimeout(() => setPopover(undefined), 3000);
                setTarget(event.target);
            }
        }
    }

    function gameHit() {
        var alive = hit();
        setState({});
        if (!alive) {
            endGame();
        }
    }

    function gameStand() {
        setStandStatus(true);
        stand();
        setState({});
        endGame();
    }
    
    function endGame() {
        setButtonDisabled(true);
        if (winnerMessage() === 'You Won!') {
            setTab((Number(tab) + (Number(bet)/ethPrice*2)).toFixed(4));
            db.collection('users').doc(address).update({
                tab: (Number(tab) + (Number(bet)/ethPrice*2)).toFixed(4)
            });
            toast.success(`${winnerMessage()} ${(Number(bet)/ethPrice).toFixed(4)} ETH`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        } else if (winnerMessage() === 'You Lost.') {
            toast.error(`${winnerMessage()} ${(Number(bet)/ethPrice).toFixed(4)} ETH`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        } else {
            setTab((Number(tab) + (Number(bet)/ethPrice)).toFixed(4));
            db.collection('users').doc(address).update({
                tab: (Number(tab) + (Number(bet)/ethPrice)).toFixed(4)
            });
            toast.dark(winnerMessage(), {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        }
    }

    return (
        <div>
            <RenderCards stand={standStatus} />
            {initialize ? (
                <div className='start-button' onClick={handleInitialize}>
                    <h1 style={{
                        fontWeight: 'bold',
                        fontSize: '110px',
                        display: 'inline',
                        paddingRight: '10px'
                    }}>
                        START &gt;
                    </h1>
                </div>
            ) : (
                <Form style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '2%',
                    transform: 'translateX(-45%)'
                }} onSubmit={startGame}>
                    <Form.Row>
                        <Col md='auto'>
                            <Button className='gray-pulse' variant='light' disabled={buttonDisabled} onClick={gameHit} active>Hit</Button>
                        </Col>
                        <Col md='auto'>
                            <Button className='gray-pulse' variant='light' disabled={buttonDisabled} onClick={gameStand} active>Stand</Button>
                        </Col>
                        <Col md={7}>
                            <InputGroup style={{border: '0'}}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text style={{border: '0'}}>$</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl style={{border: '1px solid #f1f1f4', background: '#f1f1f4'}} id="betSize" placeholder="Bet" />
                                <InputGroup.Append>
                                    <Button className='blue-pulse' type="submit" disabled={!buttonDisabled}>Start Game</Button>
                                    <Overlay show={Boolean(popover)} target={target} placement="top">
                                        <Popover id="popover-contained">
                                            <Popover.Content>
                                                {popover}
                                            </Popover.Content>
                                        </Popover>
                                    </Overlay>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Form.Row>
                </Form>
            )}
            <ToastContainer />
        </div>
    );
}

function Blackjack() {
    document.body.style.backgroundColor = "#184587";
    return (
        <div>
            <Main />
        </div>
    ) ;
}

export default Blackjack;
