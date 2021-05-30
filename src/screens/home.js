import * as React from 'react';
import {Navbar, Button, Jumbotron, Container, Card, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {SocialIcon} from 'react-social-icons';
import homeLogo from '../components/home-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function Nav() {
  return (
    <div style={{boxShadow: "0px 15px 15px #FAFAFA"}}>
      <Navbar style={{
        width: '800px', 
        margin: '0 auto'
      }} expand='true' bg="white" variant="light">
        <Navbar.Brand href='.'>
          <img src={homeLogo} alt='Logo' width="40" height="40" /> 
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
        <Link to='/blackjack'>
          <Button style={{borderRadius: '50px'}} variant="primary">Enter App</Button>
        </Link>
      </Navbar>
    </div>
  );
}

function Panel1TitleDescription() {
  return (
    <div>
      <div style={{
        width: '800px', 
        margin: '0 auto', 
        padding: '200px 0px'
      }}>
        <h1 style={{
          background: 'linear-gradient(135deg, #833196, #0057D9, #184587)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent', 
          textAlign: 'center', 
          fontSize: '55px',
          fontWeight: 'bold'
        }}>
          A Trustless Casino
        </h1>
        <p style={{
          textAlign: 'center',
          fontSize: '20px'
        }}>
          <br/>
          The decentralized casino run on the ethereum blockchain to guarantee security and fairness with Blackjack.
        </p>  
      </div>
    </div>
  )
}

function Panel2UserInfo() {
  return (
    <div>
      <div style={{paddingTop: '92px'}}>
        <div>
          <div style={{
            padding: '40px 0px',
            background: 'linear-gradient(135deg, #833196, #0057D9, #184587)',
            borderRadius: '10px',
            width: '800px', 
            height: '100px', 
            margin: '0 auto'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'white'
            }}>
              {/* Current max bet size is ? */}
              Available on Ropsten test network!
            </h3>
          </div>
        </div>
        <div style={{
          width: '800px',
          margin: '0 auto',
          paddingTop: '38px',
          paddingBottom: '65px'
        }}>
          <Jumbotron style={{
            borderRadius: '10px', 
            padding: '40px 0px'
          }}>
            <Container expand='true'>
              <h1 style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '30px'
              }}>
                Staking
              </h1>
              <p style={{
                width: '650px',
                margin: '0 auto',
                textAlign: 'center',
                fontSize: '20px'
              }}>
                <br />Coming Soon! Earn rewards by providing liquidity to OpenGames users and increasing max bet size.
              </p>
              <br />
              <div style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                  <Button style={{borderRadius: '50px'}} variant='light' target='_blank' href='https://aryaan.medium.com/bitgames-1-roadmap-f447d2b6993'>Learn more</Button>
                </div>
            </Container>
          </Jumbotron>
        </div>
      </div>
    </div>
  )
}

function Panel3Instruction() {
  return (
    <div>
      <div style={{padding: '80px 0px'}}>
        <div style={{
          display: 'inline-block', 
          padding: '0px 165px'
        }}>
          <h3 style={{
            fontSize: '36px',
            fontWeight: 'bold'
          }}>
            It's
          </h3>
          <h3 style={{
            background: 'linear-gradient(135deg, #833196, #0057D9, #184587)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            textAlign: 'center', 
            fontSize: '50px',
            fontWeight: 'bold'
          }}>
            Simple!
          </h3>
        </div>
        <div style={{paddingTop: '49px'}}>
          <Row style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw'
          }}>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title><b style={{
                    fontSize: '24px',
                    color: '#0057D9'
                  }}>
                    Connect</b>
                  </Card.Title>
                  <Card.Text style={{padding: '10px 0px'}}>
                    Click the CONNECT WALLET button in the top right to connect a browser wallet. Ex. Metamask<br /> <br />
                    Once your wallet is connected, click the CREATE USER button in the top right and accept the transaction.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title><b style={{
                    fontSize: '24px',
                    color: '#0057D9'
                  }}>
                    Deposit</b>
                  </Card.Title>
                  <Card.Text style={{padding: '10px 0px'}}>
                    Once connected, manage your balance and find important information by clicking the WALLET button at the top.<br /> <br />
                    To deposit funds, just choose the option and accept the transaction from your browser wallet.               
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card>
                <Card.Body>
                  <Card.Title><b style={{
                    fontSize: '24px',
                    color: '#0057D9'
                  }}>
                    Play</b>
                  </Card.Title>
                  <Card.Text style={{padding: '10px 0px'}}>
                    Once your transaction is accepted and the action is fulfilled, your balance will be updated as soon as possible.<br /> <br />
                    Nothing else to worry about. Just enter your bet, start up a game of blackjack, and have fun!
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
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
          display: 'block'
        }}>
          <a href='.'>
            <img src={homeLogo} alt='Logo' width='50' height='50' />
          </a>
          <span style={{float: 'right'}}>
            <a style={{paddingLeft: '10px'}} href='https://aryaan.medium.com/bitgames-1-roadmap-f447d2b6993' target='_blank'>
              <SocialIcon network='medium'></SocialIcon>
            </a>
            <a style={{paddingLeft: '10px'}} href='https://twitter.com/OpenGames8' target='_blank'>
              <SocialIcon network='twitter'></SocialIcon>
            </a> 
            <a style={{paddingLeft: '10px'}} href='https://discord.gg/58bHRuCc7n' target='_blank'>
                <SocialIcon network='discord'></SocialIcon>
            </a> 
          </span>
          
        </div>
    </div>
  );
}

function Home() {
  return (
    <div>
      <Nav />
      <Panel1TitleDescription />
      <Panel2UserInfo />
      <hr />
      <Panel3Instruction />
      <hr />
      <Footer />
    </div>
  ) 
}

export default Home;
