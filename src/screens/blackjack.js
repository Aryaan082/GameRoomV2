import * as React from 'react';
import * as Web3 from 'web3';
import {Navbar, Button, Form, Col, InputGroup, FormControl} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {SocialIcon} from 'react-social-icons';
// import {createUser, getBalance, getExistance, depositBalance, withdrawBalance, win, loss, balance} from '../components/connect-smart-contracts';
import {RenderCards, newGame, hit, stand, WinnerMessage} from '../components/blackjack/blackjack-engine';
import {EthLogo} from '../components/eth-app-logo';
import ethIcon from '../components/eth.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Nav() {
    const [balance, setBalance] = React.useState(0);
    const [tab, setTab] = React.useState(0);
    const [account, setAccount] = React.useState('');
    const [isLoading, setLoading] = React.useState(false);
    const [connectDisplay, setConnectDisplay] = React.useState('inline');
    const [infoDisplay, setInfoDisplay] = React.useState('none');
    
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
                setLoading(false);
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
            <Navbar expand='true' bg="white" variant="light">
                <Navbar.Brand href='.'>
                    <EthLogo width="40" height="40" /> 
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
                        backgroundColor: '#e9ecef',
                        borderRadius: '3px',
                        padding: '10px 8px',
                        fontSize: '16px'
                    }}>
                        <img src={ethIcon} alt='Eth:' width='25px' height='25px' />
                        &nbsp;
                        {`$${balance.toFixed(2)}`}
                    </div>
                    <Button style={{
                        display: infoDisplay,
                        marginTop: '-4px',
                        padding: '7px 12px'
                    }} variant='success'>
                        Deposit
                    </Button>
                </div>
                <div>
                    <Button style={{display: connectDisplay}} variant="primary" onClick={loadWallet} disabled={isLoading}>{isLoading ? 'Loading...' : 'Connect Wallet'}</Button>
                    <div style={{display: infoDisplay}}>{account ? 'Logged In: ' + account.charAt(0) + account.charAt(1) + account.charAt(2) + account.charAt(3) + account.charAt(4) + account.charAt(5) + '...' + account.charAt(38) + account.charAt(39) + account.charAt(40) + account.charAt(41) : null}</div>
                </div>
                
            </Navbar>
        </div>
    );
}

function BlackjackTable() {
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [standStatus, setStandStatus] = React.useState(false);
    const [displayWinner, setDisplayWinner] = React.useState('none');
    const [state, setState] = React.useState();

    function startGame() {
        setDisplayWinner('none');
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
        setDisplayWinner('inline');
        setButtonDisabled(true);
    }

    return (
        <div>
            <div style={{
                width: '970px',
                height: '470px',
                backgroundColor: '#207833',
                borderRadius: '50%',
                border: '35px solid #7d4309',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }} id='table'>
                <div style={{
                    width: '25px',
                    height: '25px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    border: '1px solid #000000',
                    position: 'absolute',
                    top: '-6.5%',
                    left: '40%',
                    padding: '1px 7px',
                    fontSize: '15px'
                }}>
                    D
                </div>
                <RenderCards stand={standStatus} />
            </div>
            <div>
                <Form style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translate(-43%, -150%)'
                }}>
                    <Form.Row>
                        <Col md='auto'>
                            <Button variant='dark' disabled={buttonDisabled} onClick={gameHit}>Hit</Button>
                        </Col>
                        <Col md='auto'>
                            <Button variant='dark' disabled={buttonDisabled} onClick={gameStand}>Stand</Button>
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
            </div>
            <div>
                <WinnerMessage display={displayWinner} />
            </div>
        </div>
    );
}

function Footer() {
  return (
    <div style={{
        position: 'absolute',
        width: '100vw',
        top: '100%'
    }}>
        <hr />
        <div style={{
          paddingTop: '30px',
          paddingBottom: '45px',
          paddingLeft: '110px',
          paddingRight: '30px',
          display: 'block'
        }}>
          <Link to='/app'>
            <EthLogo width='50' height='50' />
          </Link>
          <span style={{float: 'right'}}>
            <SocialIcon network='medium' bgColor='white' fgColor='black'></SocialIcon>
            <SocialIcon network='email' bgColor='white' fgColor='black'></SocialIcon>
            <SocialIcon network='github' bgColor='white' fgColor='black'></SocialIcon>
          </span>
          
        </div>
    </div>
  );
}

function Blackjack() {
    return (
        <div>
            <Nav />
            <BlackjackTable />
            <Footer />
        </div>
    ) ;
}

export default Blackjack;
