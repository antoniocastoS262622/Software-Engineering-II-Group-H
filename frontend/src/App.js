import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import socketIOClient from 'socket.io-client';

import Counter from './components/counter/';
import Ticket from './components/ticket/';
import Board from './components/board/';

const url = 'ws://localhost:8080';

class App extends Component {
    state = {
        socket: null
    };
    
    constructor(props) {
        super(props);

        const socket = socketIOClient(url);
        this.state = { socket };
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/ticket" render={(props) => <Ticket {...props} socket={this.state.socket} />} />
                    <Route path="/counter/:id" render={(props) => <Counter {...props} socket={this.state.socket} />} />
                    <Route path="/board" render={(props) => <Board {...props} socket={this.state.socket} />} />
                </Switch>
            </Router>
        );
    }

}

export default App;