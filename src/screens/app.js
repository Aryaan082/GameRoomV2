import * as React from 'react';
import * as Web3 from 'web3';
import {Navbar, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {SocialIcon} from 'react-social-icons';
import {EthLogo} from '../components/eth-app-logo';
import ethIcon from '../components/eth.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Nav() {
    const [status, setStatus] = React.useState('none');
    const [address, setAddress] = React.useState();
    const [balance, setBalance] = React.useState(0);
    const [tab, setTab] = React.useState(0);
    const [isLoading, setLoading] = React.useState(false);
    const [connectDisplay, setConnectDisplay] = React.useState('inline');
    const [infoDisplay, setInfoDisplay] = React.useState('none');
    
    
    const handleClick = () => setLoading(true);

    const checkConnection = async () => {
        if (window.ethereum.selectedAddress) {
            setAddress(window.ethereum.selectedAddress);
            setConnectDisplay('none');
            setInfoDisplay('inline');
        } else {
            // Check if browser is running Metamask
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
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
            
            setAddress(window.ethereum.selectedAddress);
        }
    };

    React.useEffect(() => {
        if (isLoading) {
            checkConnection();
        }
    }, [isLoading]);

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
                        marginTop: '-35px'}}>
                        <b>BitGames</b>
                    </h1>
                </Navbar.Brand>
                <div style={{
                    display: infoDisplay,
                    zIndex: '1',
                    backgroundColor: '#e9ecef',
                    borderRadius: '5px',
                    position: 'absolute',
                    padding: '7px 9px',
                    top: '50%',
                    left: '0px',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'}}>
                    <div style={{fontSize: '18px'}}>
                        <img src={ethIcon} alt='Eth:' width='25px' height='25px' />
                        &nbsp;
                        {`$${balance.toFixed(2)}`}
                    </div>
                </div>
                <Button style={{borderRadius: '50px', display: connectDisplay}} variant="primary" onClick={!isLoading ? handleClick : null} disabled={isLoading}>{isLoading ? 'Loading...' : 'Connect Wallet'}</Button>
                <Button style={{borderRadius: '50px', display: infoDisplay}} variant='outline-primary'>{address ? address.charAt(0) + address.charAt(1) + address.charAt(2) + address.charAt(3) + address.charAt(4) + address.charAt(5) + '...' + address.charAt(38) + address.charAt(39) + address.charAt(40) + address.charAt(41) : null}</Button>
            </Navbar>
        </div>
    );
}

function Footer() {
  return (
    <div>
        <div style={{
          paddingTop: '30px',
          paddingBottom: '45px',
          paddingLeft: '110px',
          paddingRight: '30px',
          display: 'block'}}>
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

function App() {
    return (
        <div>
            <Nav />
            {/* <hr />
            <Footer /> */}
        </div>
    ) ;
}

export default App;
