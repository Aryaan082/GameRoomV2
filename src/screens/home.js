import * as React from 'react';
import {Navbar} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import ReactPlayer from 'react-player';
import {SocialIcon} from 'react-social-icons';
import homeLogo from '../components/home-logo.svg';
import chipGraphic from '../components/chip-graphic.svg';
import whiteTransition from '../components/down-transition-white.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/style.css';

function Announcement() {
  return (
    <div style={{
      backgroundColor: '#0057D9',
      color: 'white',
      textAlign: 'center',
      padding: '1% 0px'
    }}>
      Available on Ropsten Testnet 🎉
    </div>
  );
}

function Nav() {
  const [navbarBackground, setNavbarBackground] = React.useState(false);
  const [navbarPosition, setNavbarPosition] = React.useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 730) {
      setNavbarBackground(true);
    } else {
      setNavbarBackground(false);
    }
    if (window.scrollY >= 45) {
      setNavbarPosition(true);
    } else {
      setNavbarPosition(false);
    }
  }

  window.addEventListener('scroll', changeBackground);

  return (
    <>
      <Navbar style={{
        zIndex: '1', 
        position: (navbarPosition ? 'fixed' : 'absolute'),
        top: (navbarPosition ? '0%' : '7%')
      }} className={navbarBackground ? 'navbar active' : 'navbar'} expand='true'>
        <Navbar.Brand href='.'>
          <img src={homeLogo} alt='Logo' width="40" height="40" /> 
          &nbsp;
          {!navbarBackground ? (
            <h1 style={{
              fontSize: '25px',
              fontWeight: 'bold',
              paddingLeft: '50px',
              marginTop: '-17.5%'
            }}>
              OpenGames
            </h1>
          ) : (
            null
          )}
        </Navbar.Brand>
        <div>
          {/* <Link className='nav-buttons' style={{paddingRight: '50px'}} to='/blackjack'>
            About
          </Link> */}
          <Link className='nav-button-main nav-buttons' to='/blackjack'>
            Play
          </Link>
        </div>
      </Navbar>
    </>
  );
}

function TitlePage() {
  return (
    <div style={{height: '100px'}}>
      <div style={{
        width: '50%', 
        margin: '0 auto', 
        padding: '17.5% 0px'
      }}>
        <h1 style={{
          textAlign: 'center', 
          fontSize: '48px',
          fontWeight: '700'
        }}>
          A decentralized and trustless casino
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: '300'
        }}>
          <br/>
          OpenGames is run on the ethereum blockchain to guarantee security and fairness.
        </p>  
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
        width: '100%',
        position: 'absolute',
        top: '17.5%',
        zIndex: '-1'
      }}>
        <div style={{width: '20px', height: '60px', borderRadius: '50px', backgroundColor: '#d5c2e1', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '100px', borderRadius: '50px', backgroundColor: '#d1c3e4', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '200px', borderRadius: '50px', backgroundColor: '#ccc5e6', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '300px', borderRadius: '50px', backgroundColor: '#c8c6e8', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '250px', borderRadius: '50px', backgroundColor: '#c4c7ea', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '130px', borderRadius: '50px', backgroundColor: '#bfc8ed', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '100px', borderRadius: '50px', backgroundColor: '#b6cbf1', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '70px', borderRadius: '50px', backgroundColor: '#b3ccf3', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '90px', borderRadius: '50px', backgroundColor: '#b3ccf0', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '100px', borderRadius: '50px', backgroundColor: '#b3ccf0', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '70px', borderRadius: '50px', backgroundColor: '#b4cbee', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '100px', borderRadius: '50px', backgroundColor: '#b5caeb', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '80px', borderRadius: '50px', backgroundColor: '#b6cae8', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '200px', borderRadius: '50px', backgroundColor: '#b6c9e5', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '150px', borderRadius: '50px', backgroundColor: '#b7c9e3', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '470px', borderRadius: '50px', backgroundColor: '#b8c8e0', zIndex: '-1'}}></div>
        <div style={{width: '20px', height: '600px', borderRadius: '50px', backgroundColor: '#b9c7dd', zIndex: '-1'}}></div>
      </div>
    </div>
  )
}

function Description() {
  return (
    <div style={{paddingTop: '57%'}}> 
      <div style={{
        background: '#454a66',
        width: '100%',
        height: '380px',
        position: 'relative'
      }}>
        <img style={{
          position: 'absolute', 
          width: '50%',
          height: '100%',
          objectFit: 'cover',
          left: '25%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }} src={chipGraphic} alt='Blockchain'></img>
        <div style={{
          color: '#ffffff',
          width: '40%',
          position: 'absolute',
          left: '75%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '500'
          }}>
            Capture onchain security
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: '300',
            paddingTop: '3%'
          }}>
            Connect and play casino games with transparency. OpenGames allows users to track their decentralized assets and bet with verifiable fairness.
          </div>
        </div>
      </div>
    </div>
  )
}

function Instruction() {
  return (
    <div>
      <h1 style={{
        textAlign: 'center',
        fontSize: '44px',
        fontWeight: '500',
        paddingTop: '12%'
      }}>
        Getting started is simple!
      </h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '5%'
      }}>
        <ReactPlayer width='800px' height='450px' controls url='https://www.youtube.com/watch?v=17rcgrZDa0w' />
      </div>
      <div style={{
        paddingTop: '4%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-around'
      }}>
        <div style={{
          height: '200px',
          width: '100%',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            fontSize: '48px',
            left: '40%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #ff004c, #833196)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent'
          }}>
            01.
          </div>
          <div style={{
            position: 'absolute',
            left: '75%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '38%'
          }}>
            <h1 style={{
              fontSize: '23px',
              fontWeight: '500'
            }}>
              Connect your wallet
            </h1>
            <p style={{
              fontSize: '20px',
              fontWeight: '300',
              color: '#333333'
            }}>
              Instantly connect to OpenGames by pressing Play and clicking the Connect Wallet button.
            </p>
          </div>
        </div>
        <div style={{
          height: '200px',
          width: '100%',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            fontSize: '48px',
            left: '40%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #833196, #0057D9)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent'
          }}>
            02.
          </div>
          <div style={{
            position: 'absolute',
            left: '75%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '38%'
          }}>
            <h1 style={{
              fontSize: '23px',
              fontWeight: '500'
            }}>
              Create your user
            </h1>
            <p style={{
              fontSize: '20px',
              fontWeight: '300',
              color: '#333333'
            }}>
              Click Create User and accept the transaction to create your very own user within the smart contract.
            </p>
          </div>
        </div>
        <div style={{
          height: '200px',
          width: '100%',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            fontSize: '48px',
            left: '40%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #0057D9, #184587)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent'
          }}>
            03.
          </div>
          <div style={{
            position: 'absolute',
            left: '75%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '38%'
          }}>
            <h1 style={{
              fontSize: '23px',
              fontWeight: '500'
            }}>
              Manage wallet funds
            </h1>
            <p style={{
              fontSize: '20px',
              fontWeight: '300',
              color: '#333333'
            }}>
              Click the Wallet button and choose to either Withdraw or Deposit funds into the smart contract.
            </p>
          </div>
        </div>
        <div style={{
          height: '200px',
          width: '100%',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            fontSize: '48px',
            left: '40%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #184587, #002c6b)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent'
          }}>
            04.
          </div>
          <div style={{
            position: 'absolute',
            left: '75%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '38%'
          }}>
            <h1 style={{
              fontSize: '23px',
              fontWeight: '500'
            }}>
              All set!
            </h1>
            <p style={{
              fontSize: '20px',
              fontWeight: '300',
              color: '#333333'
            }}>
              Input your bet (default of 0 if you won't want to spend money) for the next hand of Blackjack and click Start Game. Good luck!
            </p>
          </div>
        </div>
      </div>
      <div style={{width: '100vw'}}>
        <img style={{position: 'absolute'}} width='100%' src={whiteTransition} alt='' />
      </div>
      
    </div>
  );
}

function CommunityInfo() {
  return (
    <div style={{
      backgroundColor: '#454a66'
    }}>
      <div style={{
        paddingTop: '20%',
        textAlign: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: '500'
      }}>
        Join the community
      </div>
      <div style={{
        paddingTop: '2%',
        width: '50%',
        textAlign: 'center',
        margin: '0 auto',
        color: 'white',
        fontSize: '20px',
        fontWeight: '300'
      }}>
        If you are interested in the project or would like to be more active in the development of OpenGames, reach out! 
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <div style={{
      padding: '4% 0px',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <a href='https://aryaan.medium.com/bitgames-1-roadmap-f447d2b6993' rel="noreferrer" target='_blank'>
        <SocialIcon network='medium' fgColor='white'></SocialIcon>
      </a>
      <a style={{padding: '0px 2%'}} href='https://twitter.com/OpenGamesCasino' rel="noreferrer" target='_blank'>
        <SocialIcon network='twitter' fgColor='white'></SocialIcon>
      </a> 
      <a href='https://discord.gg/58bHRuCc7n' rel="noreferrer" target='_blank'>
          <SocialIcon network='discord' fgColor='white'></SocialIcon>
      </a>
    </div>
  );
}

function Home() {
  document.body.style.backgroundColor = "#ffffff";
  return (
    <>
      <Announcement />
      <Nav />
      <TitlePage />
      <Description />
      <Instruction />
      <CommunityInfo />
    </>
  ) 
}

export default Home;
