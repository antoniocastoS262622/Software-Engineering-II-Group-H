import React, {Component} from 'react';

import styles from './styles.css';

class Counter extends Component {
    state = {
        id: null,
        services: null
    };

    counterInfo(data) {
        //
    }
    nextClient(data) {
        //
    }
    login(password) {
        //
    }
    setup(id) {
        this.setState({ id });
        this.props.socket.on('counterInfo', this.counterInfo);
        this.props.socket.on('nextClient', this.nextClient);
    }
    render() {
        this.setup(this.props.match.params.id);

        return(
            <div>
                <h1>Counter {id}</h1>
            </div>
        );
    }
}

export default Counter;