import * as React from 'react';
import {Col, Row} from 'react-bootstrap';
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
    if (user && dealer) {
        var userCards = [];

        for (var i = 0; i < user.cardsInHand.length; i++) {
            userCards.push(<Col><playing-card rank={user.cardsInHand[i].charAt(0) === '1' ? 10 : user.cardsInHand[i].charAt(0)} suit={user.cardsInHand[i].charAt(user.cardsInHand[i].length - 1)}></playing-card></Col>);
        }

        var dealerCards = [];
        
        if (stand) {
            for (var j = 0; j < dealer.cardsInHand.length; j++) {
                dealerCards.push(<Col><playing-card rank={dealer.cardsInHand[j].charAt(0) === '1' ? 10 : dealer.cardsInHand[j].charAt(0)} suit={dealer.cardsInHand[j].charAt(dealer.cardsInHand[j].length - 1)}></playing-card></Col>);
            }
        } else {
            dealerCards.push(<Col><playing-card rank={dealer.cardsInHand[0].charAt(0) === '1' ? 10 : dealer.cardsInHand[0].charAt(0)} suit={dealer.cardsInHand[0].charAt(dealer.cardsInHand[0].length - 1)}></playing-card></Col>);
            dealerCards.push(<Col><div style={{background: 'linear-gradient(135deg, #e66465, #9198e5)', width: '75px', height: ' 105px', borderRadius: '5px'}}></div></Col>)
        }

        return (
            <div>
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: '30px',
                    transform: 'translate(-45%)'
                }}>
                    <Row md={6}>
                        {userCards}
                    </Row>
                </div>
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '30px',
                    transform: 'translate(-45%)'
                }}>
                    <Row md={6}>
                        {dealerCards}
                    </Row>
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

function WinnerMessage({display}) {
    if (display === 'none') {
        return null;
    }

    if (!dealer.checkAlive()) {
        return (
            <div>
                <img className='banner' src={userWin} alt='You Won!'></img>
            </div>
        );
    } else {
        if (!user.checkAlive() || dealer.points > user.points) {
            return (
                <div>
                    <img className='banner' src={dealerWin} alt='Dealer Won.'></img>
                </div>
            );
        } else if (dealer.points === user.points) {
            return (
                <div>
                    <img className='banner' src={push} alt='It was a Tie.'></img>
                </div>
            );
        }  else {
            return (
                <div>
                    <img className='banner' src={userWin} alt='You Won!'></img>
                </div>
            );
        }
    }
}

// function showDealerPointsCovered() {
//     dealerPoints.style.position = "absolute";
//     dealerPoints.style.left = "10px";
//     dealerPoints.style.bottom = "0px";
//     dealerPoints.innerHTML = "Dealer Points: ?";
//     document.getElementById("main").append(dealerPoints);
// }

// function showDealerPointsUncovered() {
//     dealerPoints.innerHTML = "Dealer Points: " + dealer.points;
// }

// function showUserPoints() {
//     userPoints.style.position = "absolute";
//     userPoints.style.right = "10px";
//     userPoints.style.bottom = "0px";
//     userPoints.innerHTML = "<b>Your Points: " + user.points + "</b>";
//     document.getElementById("main").append(userPoints);
// }

// function hit() {
//     user.addCardToHand();
//     showUserCards();
//     showUserPoints();
//     if (!user.checkStatus()) {
//         displayWinner();
//         startButtons();
//     }
// }

// function stand() {
//     while (dealer.points < 17 && dealer.points < user.points) {
//         dealer.addCardToHand();
//     }

//     coveredCard.src = "";
//     dealerCardCovered.src = "";

//     showDealerPointsUncovered();
//     showDealerCardsUncovered();
//     displayWinner();

//     startButtons();
// }

// function displayWinner() {
//     winnerMessage.style.position = "absolute";
//     winnerMessage.style.left = "50%";
//     winnerMessage.style.top = "50%"
//     winnerMessage.style.transform = "translate(-50%, -50%)";
//     winnerMessage.style.width = "500px";
//     document.getElementById("ovalTable").appendChild(winnerMessage);
//     if (!dealer.checkStatus()) {
//         winnerMessage.src = "../public/images/YouWinBanner.png";
//         console.log(userTab);
//         console.log(Number(betSize.value));
//         usersRef.doc(account).update({
//             tab: userTab + Number(betSize.value) * 2
//         });
//     } else {
//         if (!user.checkStatus() || dealer.points > user.points) {
//             winnerMessage.src = "../public/images/DealerWinsBanner.png";
//         } else if (dealer.points == user.points) {
//             winnerMessage.src = "../public/images/PushBanner.png";
//             console.log(userTab);
//             console.log(Number(betSize.value));
//             usersRef.doc(account).update({
//                 tab: userTab + Number(betSize.value)
//             });
//         } else {
//             winnerMessage.src = "../public/images/YouWinBanner.png";
//             console.log(userTab);
//             console.log(Number(betSize.value));
//             usersRef.doc(account).update({
//                 tab: userTab + Number(betSize.value) * 2
//             });
//         } 
//     }
// }

export {RenderCards, newGame, hit, stand, WinnerMessage};
