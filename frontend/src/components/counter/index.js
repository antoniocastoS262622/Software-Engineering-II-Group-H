import React, {Component} from 'react';

import styles from './styles.css';

class Counter extends Component {
    state = {
        id: null,
        services: null
    };

    getCounterInfo() {
        this.props.socket.send({
            command: 'getCounterInfo'
        });
    }

    serveNext() {
        this.props.socket.send({
            command: 'serveNext'
        });
    }

    counterInfo(data) {
        this.setState({
            id: data.id,
            services: data.requestTypes
        });
    }

    nextClient(data) {
        //
    }

    login(id, password) {
        this.props.socket.emit('join', {
            role: 'counter',
            id,
            password
        });
    }

    setup(id) {
        this.login(id, 'counter' + id);

        this.props.socket.on('counterInfo', this.counterInfo.bind(this));
        this.props.socket.on('nextClient', this.nextClient.bind(this));

        this.getCounterInfo();
    }

    render() {
        this.setup(parseInt(this.props.match.params.id));

        return(
            <div>
                <h1>Counter</h1>
            </div>
        );
    }
}

export default Counter;