import * as React from 'react';
import * as Web3 from 'web3';
import {Navbar, Button, Form, Col, InputGroup, FormControl, Modal, Tabs, Tab} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
// import {createUser, getBalance, getExistance, depositBalance, withdrawBalance, win, loss, balance} from '../components/connect-smart-contracts';
import {RenderCards, newGame, hit, stand, winnerMessage} from '../components/blackjack/blackjack-engine';
import ethLogo from '../components/eth-app-logo.png';
import ethIcon from '../components/eth.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../components/style.css';

function Nav() {
    const [balance, setBalance] = React.useState(0);
    const [tab, setTab] = React.useState(0);
    const [account, setAccount] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);
    const [connectDisplay, setConnectDisplay] = React.useState('inline');
    const [infoDisplay, setInfoDisplay] = React.useState('none');
    const [depositDisplay, setDepositDisplay] = React.useState(false);

    const handleClose = () => setDepositDisplay(false);
    const handleShow = () => setDepositDisplay(true);
    
    var address = '';
    window.web3 = new Web3(window.ethereum);
    getAddress();
    updateInterval();
    
    async function updateInterval() {
        var update = setInterval(async () => {
            if (address === undefined) {
                console.log("Wallet is disconnected");
                setConnectDisplay('inline');
                setInfoDisplay('none');
                clearInterval(update);
                setLoading(false);
            } else {
                updateVariables();
            }
        }, 1000);
    }
    
    async function updateVariables() {
        setConnectDisplay('none');
        setInfoDisplay('inline');
        await getAddress();
        setAccount(address);
        // await getBalance();
        // await getExistance();
    }
    
    async function loadWallet() {
        setLoading(true);
        await loadWeb3();
        await getAddress();
    }

    async function loadWeb3() {
        // Check if browser is running Metamask
        if (window.ethereum) {
            try {
                // Request account access if needed
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                return error;
            }
            setConnectDisplay('none');
            setInfoDisplay('inline');
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(this.web3.currentProvider);
        }
    };

    async function getAddress() {
        window.web3.eth.getAccounts().then((addresses) => {
            address = addresses[0];
        });
    }

    return (
        <div>
            <Navbar style={{backgroundColor: '#002c6b', width: '100%'}} expand='true' variant="dark">
                <Navbar.Brand href='.'>
                    <img style={{width: '40px'}} src={ethLogo} alt='Logo'></img>
                    &nbsp;
                    <h1 style={{
                        fontSize: '25px',
                        display: 'flex',
                        paddingLeft: '50px',
                        marginTop: '-35px'
                    }}>
                        <b>OpenGames</b>
                    </h1>
                </Navbar.Brand>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <div style={{
                        display: infoDisplay,
                        zIndex: '1',
                        backgroundColor: '#082857',
                        borderRadius: '5px',
                        padding: '10px 8px',
                        fontSize: '16px',
                        color: '#ffffff'
                    }}>
                        <img src={ethIcon} alt='Eth:' width='25px' height='25px' />
                        &nbsp;
                        {`$${balance.toFixed(2)}`}
                    </div>
                    <Button style={{
                        display: infoDisplay,
                        marginTop: '-4px',
                        padding: '7px 12px'
                    }} variant='success' onClick={handleShow}>
                        Deposit
                    </Button>
                </div>
                <div>
                    <Button style={{display: connectDisplay}} variant="primary" onClick={loadWallet} disabled={isLoading}>{isLoading ? 'Loading...' : 'Connect Wallet'}</Button>
                    <div style={{color: '#ffffff', display: infoDisplay, fontSize: '18px'}}>{account ? 'Logged In: ' + account.charAt(0) + account.charAt(1) + account.charAt(2) + account.charAt(3) + account.charAt(4) + account.charAt(5) + '...' + account.charAt(38) + account.charAt(39) + account.charAt(40) + account.charAt(41) : null}</div>
                </div>
            </Navbar>
            <Modal show={depositDisplay} onHide={handleClose} size='md' centered>
                <Modal.Header closeButton>
                    <Modal.Title>Deposit</Modal.Title>
                </Modal.Header>
                    {/* <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body> */}
                    <Tabs style={{paddingTop: '10px', paddingLeft: '10px'}} defaultActiveKey="deposit" transition={false}>
                        <Tab eventKey="deposit" title="Deposit">
                            <Modal.Body>
                                <p>Thank you for choosing this feature! At the moment OpenGames is still developing this feature but check back soon to deposit and play blackjack!</p>
                            </Modal.Body>
                        </Tab>
                        <Tab eventKey="withdraw" title="Withdraw">
                            <Modal.Body>
                                <p>Thank you for choosing this feature! At the moment OpenGames is still developing this feature but check back soon to deposit and play blackjack!</p>
                            </Modal.Body>
                        </Tab>
                    </Tabs>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

function BlackjackTable() {
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [standStatus, setStandStatus] = React.useState(false);
    const [state, setState] = React.useState();

    

    function startGame() {
        setButtonDisabled(false);
        setStandStatus(false);
        newGame();
        setState({});
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
            toast.success(winnerMessage(), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        } else if (winnerMessage() === 'You Lost.') {
            toast.error(winnerMessage(), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        } else {
            toast.dark(winnerMessage(), {
                position: "top-right",
                autoClose: 5000,
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
            <Form style={{
                position: 'absolute',
                left: '50%',
                bottom: '2%',
                transform: 'translateX(-45%)'
            }}>
                <Form.Row>
                    <Col md='auto'>
                        <Button variant='light' disabled={buttonDisabled} onClick={gameHit}>Hit</Button>
                    </Col>
                    <Col md='auto'>
                        <Button variant='light' disabled={buttonDisabled} onClick={gameStand}>Stand</Button>
                    </Col>
                    <Col md={7}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>$</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl id="betSize" placeholder="Bet" />
                            <InputGroup.Append>
                                <Button variant="primary" onClick={startGame} disabled={!buttonDisabled}>Start Game</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Form.Row>
            </Form>
            <ToastContainer />
        </div>
    );
}

function Blackjack() {
    document.body.style.backgroundColor = "#184587";
    return (
        <div>
            <Nav />
            <BlackjackTable />
        </div>
    ) ;
}

export default Blackjack;
