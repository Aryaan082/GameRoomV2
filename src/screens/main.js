import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './home';
import Blackjack from './blackjack';
import NoPage from './nopage';

// colors: #ff004c #e9ecef #0057D9

function Main() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/blackjack' component={Blackjack} />
                    <Route path='*' component={NoPage} />
                </Switch>
            </div>
        </Router>
    );
}

export default Main;