import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import socketIOClient from 'socket.io-client';

import Counter from './components/counter';
import Ticket from './components/ticket';

const url = 'ws://localhost:8080';

class App extends Component {
    state = {
        socket: null
    };
    
    componentDidMount() {
        const socket = socketIOClient(url);
        this.setState({ socket });
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/ticket">
                        <Ticket />
                    </Route>
                    <Route path="/counter/:id" component={Counter} />
                </Switch>
            </Router>
        );
    }

}

export default App;