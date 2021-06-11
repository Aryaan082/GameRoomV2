import * as React from 'react';
import * as Web3 from 'web3';
import * as CoinGecko from 'coingecko-api';
import {Navbar, Button, Form, Col, InputGroup, FormControl, Modal, Tabs, Tab, Overlay, Tooltip, Popover, Dropdown, Spinner} from 'react-bootstrap';
import {ToastContainer, toast} from 'react-toastify';
import PuffLoader from 'react-spinners/PuffLoader';
import {SocialIcon} from 'react-social-icons';
import {loadContract, createUser, getBalance, getExistance, depositBalance, withdrawBalance, getLiquidity} from '../components/connect-smart-contracts';
import {RenderCards, newGame, hit, stand, winnerMessage} from '../components/blackjack/blackjack-engine';
import {db} from '../firebase';
import ethLogo from '../components/eth-logo.svg';
import ethIcon from '../components/eth-icon.svg';
import bugIcon from '../components/bug-icon.svg';
import walletIcon from '../components/wallet-icon.svg';
import discordIcon from '../components/discord-icon.svg';
import docsIcon from '../components/docs-icon.svg';
import testnetInstructions from '../components/testnet-instructions.gif';
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
    const [tabInfo, setTabInfo] = React.useState(false);
    const [liquidityInfo, setLiquidityInfo] = React.useState(false);

    const tabInfoTarget = React.useRef(null);
    const liquidityInfoTarget = React.useRef(null);

    const handleChange = (event) => setAmount(event.target.value);

    const handleTabMouseOver = () => setTabInfo('This is your running total. To settle your tab, just withdraw.');
    const handleTabMouseLeave = () => setTabInfo(false);

    const handleLiquidityMouseOver = () => setLiquidityInfo('This is the total amount available to win. Liquidity determines maximum available payout.');
    const handleLiquidityMouseLeave = () => setLiquidityInfo(false);

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
            <p style={{textAlign: 'left'}}>Your Tab: <b>{Number(tab)} ETH</b>
                <span style={{
                    float: 'right',
                    fontSize: '20px',
                    fontWeight: '800'
                }} ref={tabInfoTarget} onMouseOver={handleTabMouseOver} onMouseLeave={handleTabMouseLeave}>
                    ?
                </span>
                <Overlay target={tabInfoTarget.current} show={Boolean(tabInfo)} placement="left">
                    <Tooltip>
                        {tabInfo}
                    </Tooltip>
                </Overlay>
            </p>
            <p style={{textAlign: 'left'}}>Current Liquidity: <b>{Number(liquidity)} ETH</b>
                <span style={{
                    float: 'right',
                    fontSize: '20px',
                    fontWeight: '800'
                }} ref={liquidityInfoTarget} onMouseOver={handleLiquidityMouseOver} onMouseLeave={handleLiquidityMouseLeave}>
                    ?
                </span>
                <Overlay target={liquidityInfoTarget.current} show={Boolean(liquidityInfo)} placement="left">
                    <Tooltip>
                        {liquidityInfo}
                    </Tooltip>
                </Overlay>
            </p>
            
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
                    <Overlay show={Boolean(popover)} target={target} placement="bottom">
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

function WalletModal({address, show, onHide, walletBalance, siteBalance, tab, liquidity, setTab, setDisplaySpinner}) {
    const [popover, setPopover] = React.useState(false);
    const [target, setTarget] = React.useState(null);

    function handleSubmitDeposit(event) {
        event.preventDefault();
        var regExp = /[a-zA-Z]/g;
        var depositAmount = event.target.elements[0].value;
        if (regExp.test(depositAmount) || depositAmount === '') {
            setPopover('Input error! Try again with an available value.');
            setTarget(event.target);
            setTimeout(() => setPopover(undefined), 3000);
            console.log('Input is not an available value.');
        } else {
            setPopover(undefined);
            setDisplaySpinner(true);
            depositBalance(address, depositAmount)
            .then(() => {
                setDisplaySpinner(false);
            })
            .catch(() => {
                setDisplaySpinner(false);
            });
            onHide();
        }
    }

    function handleSubmitWithdraw(event) {
        event.preventDefault();
        var regExp = /[a-zA-Z]/g;
        var withdrawAmount = event.target.elements[0].value;
        var tabPlaceholder;
        if (regExp.test(withdrawAmount) || withdrawAmount === '') {
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
                setDisplaySpinner(true);
                withdrawBalance(address, withdrawAmount, String(tab))
                .then(() => {
                    tabPlaceholder = (Number(withdrawAmount) > Number(tab) ? 0 : Number(tab) - Number(withdrawAmount));
                    setTab(tabPlaceholder.toFixed(4));
                    setDisplaySpinner(false);
                    db.collection('users').doc(address).update({
                        tab: tabPlaceholder.toFixed(4)
                    });
                })
                .catch(() => {
                    setDisplaySpinner(false);
                });
                onHide();
            }
            
        }
    }

    return (
        <Modal show={show} size='md' centered>
            <h1 style={{
                fontSize: '18px',
                fontWeight: '600',
                paddingTop: '20px',
                paddingLeft: '20px'
            }}>
                Wallet
                <button className='close x-close' onClick={onHide}>
                    <span>&times;</span>
                </button>
            </h1>
            
            <Tabs style={{paddingTop: '10px', paddingLeft: '10px'}} defaultActiveKey="deposit">
                <Tab eventKey="deposit" title="Deposit">
                    <WalletForm type='Deposit' walletBalance={walletBalance} siteBalance={siteBalance} tab={tab} liquidity={liquidity} setTab={setTab} popover={popover} setPopover={setPopover} target={target} setTarget={setTarget} onSubmit={handleSubmitDeposit} />
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                    <WalletForm type='Withdraw' walletBalance={walletBalance} siteBalance={siteBalance} tab={tab} liquidity={liquidity} setTab={setTab} popover={popover} setPopover={setPopover} target={target} setTarget={setTarget} onSubmit={handleSubmitWithdraw} />
                </Tab>
            </Tabs>
        </Modal>
    );
}

function BugReportModal({show, onHide, onClick}) {
    return (
        <Modal show={show} size='md' centered>
            <h1 style={{
                fontSize: '18px',
                fontWeight: '600',
                paddingTop: '20px',
                paddingLeft: '20px'
            }}>
                Report Bug + Feature Request
                <button className='close x-close' onClick={onHide}>
                    <span>&times;</span>
                </button>
            </h1>
            <Modal.Body>
                <p style={{padding: '0px 5px'}}>
                    If you would like to report a bug, request a feature, or be more involved, join the Discord server or Follow our twitter to share your thoughts!
                </p>
                <div style={{
                    padding: '4% 0px',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <a style={{paddingRight: '20px'}} href='https://twitter.com/OpenGamesCasino' rel="noreferrer" target='_blank'>
                        <SocialIcon network='twitter' fgColor='white'></SocialIcon>
                    </a> 
                    <a href='https://discord.gg/58bHRuCc7n' rel="noreferrer" target='_blank'>
                        <SocialIcon network='discord' fgColor='white'></SocialIcon>
                    </a>
                </div>
            </Modal.Body>
        </Modal>
    );
}

function BrowserWalletInstructionsModal({show, onHide}) {
    return (
        <Modal show={show} size='md' backdrop='static' keyboard={false} centered>
            <div style={{
                padding: '30px 20px'
            }}>
                <h1 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#3686ff',
                    textAlign: 'center'
                }}>
                    No Browser Wallet Available
                </h1>
                <p style={{
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#707070',
                    textAlign: 'center'
                }}>
                    Download a browser wallet like <a style={{color: '#3686ff'}} href='https://metamask.io/download.html' rel="noreferrer" target='_blank'>Metamask</a> to Connect to OpenGames or continue and play for Free!
                </p>
                <Button className='modal-button' onClick={onHide}>Got it!</Button>
            </div>
        </Modal>
    );
}

function ChainAlertInstructionModal({show, onHide}) {
    return (
        <Modal show={show} size='md' backdrop='static' keyboard={false} centered>
            <div style={{
                padding: '30px 20px'
            }}>
                <h1 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#3686ff',
                    textAlign: 'center'
                }}>
                    Unavailable Chain Selected
                </h1>
                <p style={{
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#707070',
                    textAlign: 'center'
                }}>
                    Select the Ropsten Test Network to continue using OpenGames or continue for free! 
                </p>
                <img style={{display: 'block', margin: '0 auto', paddingBottom: '20px'}} width='150px' src={testnetInstructions} alt='testnet instructions' />
                <Button className='modal-button' onClick={onHide}>Done!</Button>
            </div>
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
    const [exists, setExists] = React.useState(false);
    const [isLoadingUser, setLoadingUser] = React.useState(false);
    const [bugModal, setBugModal] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [browserWalletAvailable, setBrowserWalletAvailable] = React.useState(false);
    const [chainID, setChainID] = React.useState('');
    const [chainAlert, setChainAlert] = React.useState(false);
    const [displaySpinner, setDisplaySpinner] = React.useState(false);

    const handleCloseBugModal = () => setBugModal(false);
    const handleShowBugModal = () => setBugModal(true);

    const handleCloseWalletModal = () => setWalletModal(false);
    const handleShowWalletModal = () => setWalletModal(true);

    const handleCloseBrowserWalletInstructionsModal = () => setBrowserWalletAvailable(false);
    const handleShowBrowserWalletInstructionsModal = () => setBrowserWalletAvailable(true);

    const handleCloseChainAlert = () => setChainAlert(false);
    const handleShowChainAlert = () => setChainAlert(true);
    
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
            setChainID(window.web3._provider.chainId);
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
                setExists();
                console.log('User does not exist');
            });
            getBalance(address).then(smartContractBalance => {
                balance = Number(Web3.utils.fromWei(smartContractBalance, "ether")).toFixed(4);
                setSiteBalanceEth(balance);
                balance = Number(Web3.utils.fromWei(smartContractBalance, "ether") * ethPrice).toFixed(4)
                setSiteBalanceUsd(balance);
            }).catch(() => {
                setSiteBalanceEth();
                setSiteBalanceUsd();
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
        setBrowserWalletAvailable(!Boolean(window.web3.givenProvider));
        setLoading(true);

        if (!Boolean(window.web3.givenProvider)) {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }

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
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setConnected(true);
            } catch (error) {
                // User denied account access...
                setLoading(false);
                return error;
            }
        }
    }

    function createAccountUser() {
        setChainID(window.web3._provider.chainId);
        if (window.web3._provider.chainId !== '0x3') {
            handleShowChainAlert();
        } else {
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
    }

    function getNetwork() {
        if (chainID === '0x1') {
            return 'Mainnet';
        } else if (chainID === '0x3') {
            return 'Ropsten Testnet';
        }
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
                                    <>
                                        {displaySpinner ? (
                                            <div style={{
                                                position: 'absolute',
                                                transform: 'translate(-100%, 10%)'
                                            }}>
                                                <Spinner variant='white' animation='border'></Spinner>
                                            </div>
                                        ) : (
                                            null
                                        )}
                                        <Dropdown>
                                            <Dropdown.Toggle style={{
                                                color: 'white',
                                                fontSize: '18px'
                                            }} variant='white'>
                                                {account.charAt(0) + account.charAt(1) + account.charAt(2) + account.charAt(3) + account.charAt(4) + account.charAt(5) + '...' + account.charAt(38) + account.charAt(39) + account.charAt(40) + account.charAt(41)}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu style={{
                                                padding: '0px 0px',
                                                borderRadius: '10px'
                                            }}>
                                                <Dropdown.Item className='dropdown-item' onClick={handleShowWalletModal}>
                                                    <img width='20px' src={walletIcon} alt='' /> &nbsp;
                                                    Wallet
                                                </Dropdown.Item>
                                                <Dropdown.Item className='dropdown-item' href='https://discord.gg/58bHRuCc7n' rel="noreferrer" target='_blank'>
                                                    <img width='20px' src={discordIcon} alt='' /> &nbsp;
                                                    Discord
                                                </Dropdown.Item>
                                                <Dropdown.Item className='dropdown-item' href='https://github.com/Aryaan962/GameRoomV2' rel="noreferrer" target='_blank'>
                                                    <img width='20px' src={docsIcon} alt='' /> &nbsp;
                                                    Docs
                                                </Dropdown.Item>
                                                <Dropdown.Item style={{textAlign: 'center', color: 'black'}} className='dropdown-item' disabled>
                                                    {getNetwork()}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </>
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
                    <BugReportModal show={bugModal} onHide={handleCloseBugModal}/>
                    <WalletModal address={account} liquidity={liquidity} show={walletModal} onHide={handleCloseWalletModal} walletBalance={walletBalance} siteBalance={siteBalanceEth} setSiteBalance={setSiteBalanceEth} tab={tab} setTab={setTab} setDisplaySpinner={setDisplaySpinner} />
                    <BrowserWalletInstructionsModal show={browserWalletAvailable} onHide={handleCloseBrowserWalletInstructionsModal} />
                    <ChainAlertInstructionModal show={chainAlert} onHide={handleCloseChainAlert} />
                </>
            )}
        </div>
    );
}

function BlackjackGame({address, tab, setTab, siteBalance}) {
    const [gameStarted, setGameStarted] = React.useState(false);
    const [standStatus, setStandStatus] = React.useState(false);
    const [initialize, setInitialize] = React.useState(true);
    const [popover, setPopover] = React.useState(false);
    const [state, setState] = React.useState();
    const [bet, setBet] = React.useState(0);

    const target = React.useRef(null);

    var betAmount;

    const handleInitialize = () => {
        setInitialize(false);
        startGame(0);
    }

    // not in proper scope. can only read value of gameStarted where event listener is called
    // const logKey = (e) => {
    //     console.log(gameStarted);
    //     console.log(e.key.toUpperCase());
    //     if (e.key.toUpperCase() === 'Q') {
    //         gameHit();
    //     } else if (e.key.toUpperCase() === 'W') {
    //         gameStand();
    //     } else if (e.key.toUpperCase() === 'E') {
    //         startGame(bet);
    //     }
    // }

    function startGame(event) {
        if (gameStarted) {
            return;
        }
        setPopover(undefined);
        var regExp = /[a-zA-Z]/g;
        
        if (event === 0) {
            betAmount = 0;
            setBet(0);
        } else {
            event.preventDefault();
            betAmount = event.target[2].value;
            setBet(betAmount);
        }
        if (regExp.test(betAmount)) {
            setPopover('Input error! Try again with an available value.');
            setTimeout(() => setPopover(undefined), 3000);
            console.log('Input is not an available value.');
        } else {
            if (Number(betAmount) === 0) {
                setGameStarted(true);
                setStandStatus(false);
                newGame();
                setState({});                
            } else if (Number(siteBalance) + Number(tab) - Number(betAmount)/ethPrice >= 0 && address) {
                setGameStarted(true);
                setStandStatus(false);
                setTab((Number(tab) - (Number(betAmount)/ethPrice)).toFixed(4));
                db.collection('users').doc(address).update({
                    tab: (Number(tab) - (Number(betAmount)/ethPrice)).toFixed(4)
                }).then(() => {
                    newGame();
                    setState({}); 
                })
                .catch(() => {
                    console.log('Error betting.');
                });
            } else {
                setPopover('Unable to bet. Deposit more to play.');
                setTimeout(() => setPopover(undefined), 3000);
            }
        }
    }

    function gameHit() {
        if (!gameStarted) {
            return;
        }
        var alive = hit();
        setState({});
        if (!alive) {
            endGame();
        }
    }

    function gameStand() {
        if (!gameStarted) {
            return;
        }
        setStandStatus(true);
        stand();
        setState({});
        endGame();
    }
    
    function endGame() {
        setGameStarted(false);
        if (winnerMessage() === 'You Won!') {
            if (address) {
                setTab((Number(tab) + (Number(bet)/ethPrice*2)).toFixed(4));
                db.collection('users').doc(address).update({
                    tab: (Number(tab) + (Number(bet)/ethPrice*2)).toFixed(4)
                });
            }
            toast.success(`${winnerMessage()} $${Number(bet).toFixed(4)}`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        } else if (winnerMessage() === 'You Lost.') {
            toast.error(`${winnerMessage()} $${Number(bet).toFixed(4)}`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        } else {
            if (address) {
                setTab((Number(tab) + (Number(bet)/ethPrice)).toFixed(4));
                db.collection('users').doc(address).update({
                    tab: (Number(tab) + (Number(bet)/ethPrice)).toFixed(4)
                });
            }
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
                        fontWeight: '400',
                        fontSize: '110px',
                        display: 'inline',
                        paddingRight: '10px'
                    }}>
                        Start &gt;
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
                            <Button className='gray-pulse' variant='light' disabled={!gameStarted} onClick={gameHit} active>Hit</Button>
                        </Col>
                        <Col md='auto'>
                            <Button className='gray-pulse' variant='light' disabled={!gameStarted} onClick={gameStand} active>Stand</Button>
                        </Col>
                        <Col md={7}>
                            <InputGroup style={{border: '0'}}>
                                <InputGroup.Prepend>
                                    <InputGroup.Text style={{border: '0'}}>$</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl style={{border: '1px solid #f1f1f4', background: '#f1f1f4'}} id="betSize" placeholder="Bet" />
                                <InputGroup.Append>
                                    <Button className='blue-pulse' ref={target} type="submit" disabled={gameStarted}>Start Game</Button>
                                    <Overlay show={Boolean(popover)} target={target.current} placement="top">
                                        <Popover>
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
    );
}

export default Blackjack;
