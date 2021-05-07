import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './home';
import App from './app';
import NoPage from './nopage';


function Main() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/app' component={App} />
                    <Route path='*' component={NoPage} />
                </Switch>
            </div>
        </Router>
    );
}

export default Main;