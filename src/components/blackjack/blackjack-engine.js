import * as React from 'react';
import {Col, Row, Image} from 'react-bootstrap';
import {CardHand} from './card-hand';
import userWin from '../images/YouWinBanner.png';
import dealerWin from '../images/DealerWinsBanner.png';
import push from '../images/PushBanner.png';
import 'playing-card';
import '../style.css'

let user;
let dealer;

function newGame() {
    user = new CardHand("User");
    dealer = new CardHand("Dealer");

    startGame();
    return user.cardsInHand;
    
    // if (account != undefined) {
    //     if (Number(web3.utils.fromWei(userBalance, "ether")) + userTab - Number(betSize.value) >= 0) {
    //         usersRef.doc(account).update({
    //             tab: userTab - betSize.value
    //         });
    //         startGame();
    //     }
    // } else {
    //     startGame();
    // }
    
}

function startGame() {
    user.addCardToHand();
    dealer.addCardToHand();
    user.addCardToHand();
    dealer.addCardToHand();
}

function RenderCards({stand}) {
    function dealerPoints() {
        if (stand === true) {
            return dealer.points;
        } else {
            return '?';
        }
    }

    if (user && dealer) {
        var dealerCards = [];
        var offsetDealer;

        for (var j = 0; j < dealer.cardsInHand.length; j++) {
            offsetDealer = Math.pow(1.77, -j + 6.3) + 9.3;
        }
        
        if (stand) {
            for (var jj = 0; jj < dealer.cardsInHand.length; jj++) {
                var jjj = jj * offsetDealer;
                dealerCards.push(<Col style={{position: 'relative', right: `${jjj}%`}}><playing-card rank={dealer.cardsInHand[jj].charAt(0) === '1' ? 10 : dealer.cardsInHand[jj].charAt(0)} suit={dealer.cardsInHand[jj].charAt(dealer.cardsInHand[jj].length - 1)}></playing-card></Col>);
            }
        } else {
            dealerCards.push(<Col><playing-card style={{display: 'inline-block'}} rank={dealer.cardsInHand[0].charAt(0) === '1' ? 10 : dealer.cardsInHand[0].charAt(0)} suit={dealer.cardsInHand[0].charAt(dealer.cardsInHand[0].length - 1)}></playing-card></Col>);
            dealerCards.push(<Col style={{position: 'relative', right: '29.918559090014792%'}}><div style={{background: 'linear-gradient(135deg, #e66465, #9198e5)', width: '5rem', height: ' 7rem', borderRadius: '4px', display: 'inline-block'}}></div></Col>)
        }

        var userCards = [];
        var offsetUser;
 
        for (var i = 0; i < user.cardsInHand.length; i++) {
            offsetUser = Math.pow(1.77, -i + 6.3) + 9.3;
        }
        console.log(offsetUser)

        for (var ii = 0; ii < user.cardsInHand.length; ii++) {
            var iii = ii * offsetUser;
            userCards.push(<Col style={{position: 'relative', right: `${iii}%`}}><playing-card rank={user.cardsInHand[ii].charAt(0) === '1' ? 10 : user.cardsInHand[ii].charAt(0)} suit={user.cardsInHand[ii].charAt(user.cardsInHand[ii].length - 1)}></playing-card></Col>);
        }

        return (
            <div>
                <div>
                    <div style={{
                        color: '#ffffff', 
                        fontSize: '30px',
                        position: 'absolute',
                        left: '15%',
                        top: '18%'
                    }}>
                        <b>Dealer </b>
                        <div className='points'>
                            <p style={{
                                color: '#000000',
                                position: 'absolute',
                                left: '50%',
                                top: '12px',
                                transform: 'translateX(-50%)',
                                fontSize: '25px'
                            }}>
                                {dealerPoints()}
                            </p>
                        </div>
                    </div>
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-25%)',
                        top: '15%',
                    }}>
                        <Row>
                            {dealerCards}
                        </Row>
                    </div>
                </div>
                
                <div>
                    <div style={{
                        color: '#ffffff', 
                        fontSize: '30px',
                        position: 'absolute',
                        left: '18%',
                        bottom: '18%'
                    }}>
                        <b>You </b>
                        <div className='points'>
                            <p style={{
                                color: '#000000',
                                position: 'absolute',
                                left: '50%',
                                top: '12px',
                                transform: 'translateX(-50%)',
                                fontSize: '25px'
                            }}>
                                {user.points}
                            </p>
                        </div>
                    </div>
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-25%)',
                        bottom: '15%'
                    }}>
                        <Row>
                            {userCards}
                        </Row>
                    </div>
                </div>
            </div>  
        );
    } else {
        return (
            <div></div>
        );
    }
}

function hit() {
    user.addCardToHand();
    if (!user.checkAlive()) {
        return false;
    }
    return true;
}

function stand() {
    while (dealer.points < 17 && dealer.points < user.points) {
        dealer.addCardToHand();
    }
}

function winnerMessage() {
    if (!dealer || !user) {
        return;
    }

    if (!dealer.checkAlive()) {
        return 'You Won!';
    } else {
        if (!user.checkAlive() || dealer.points > user.points) {
            return 'You Lost.';
        } else if (dealer.points === user.points) {
            return 'You Tied.';
        }  else {
            return 'You Won!';
        }
    }
}

export {RenderCards, newGame, hit, stand, winnerMessage};
