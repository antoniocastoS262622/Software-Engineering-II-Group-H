import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Ticket from "./components/ticket";
import Counter from "./components/counter";
import Board from "./components/board";

const routing = (
    <Router>
        <Switch>
            <Route exact path='/' render={() => <App />} />
            <Route path="/ticket" render={(props) => <Ticket {...props} />} />
            <Route path="/counter/:id" render={(props) => <Counter {...props} />} />
            <Route path="/board" render={(props) => <Board {...props} />} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
