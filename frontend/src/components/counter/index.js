import React, {Component} from 'react';
import Loader from 'react-loader-spinner';

import styles from './styles.module.css';

class Counter extends Component {
    state = {
        id: null,
        services: null,
        ticket: null,

        password: '',
        loggingIn: false
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

    loginSuccessful() {
        this.getCounterInfo();
    }

    counterInfo(data) {
        this.setState({
            id: data.id,
            services: data.requestTypes
        });
    }

    nextClient(data) {
        this.setState({ ticket: data.code });
    }

    login(id, password) {
        this.setState({ loggingIn: true });
        this.props.socket.emit('join', {
            role: 'counter',
            id,
            password
        });
    }

    setup() {
        this.props.socket.on('loginSuccessful', this.loginSuccessful.bind(this));
        this.props.socket.on('counterInfo', this.counterInfo.bind(this));
        this.props.socket.on('nextClient', this.nextClient.bind(this));
    }

    componentDidMount() {
        this.setup();
    }

    render() {
        return (
            <div className={styles.container}>
                {this.state.id === null && this.state.loggingIn === false && (
                    <div className={styles.loginContainer}>
                        <h1>Authorization required</h1>
                        <p>Access to the counter dashboard is protected by password. Please authenticate.</p>
                        <input className={styles.passwordInput} type="password" onChange={(e) => this.setState({ password: e.target.value })} />
                        <button onClick={() => this.login(parseInt(this.props.match.params.id), this.state.password)}>login</button>
                    </div>
                )}
                {this.state.id === null && this.state.loggingIn === true && (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}>
                            <Loader type="TailSpin" color="#444" height={50} width={50} />
                        </div>
                    </div>
                )}
                {this.state.id !== null && (
                    <div className={styles.counterContainer}>
                        <h1>Counter {this.state.id}</h1>
                        <p>Handled request types: &emsp;
                            {this.state.services.map(service => (
                                <span className={styles.tag}>{service}</span>
                            ))}
                        </p>
                        <h1 className={styles.servedTicket}>{this.state.ticket || '\u00B7\u00B7\u00B7'}</h1>
                        <p>is the current ticket being served</p>
                        <button className={styles.serveNextButton} onClick={() => this.serveNext()}>serve next</button>
                    </div>
                )}
            </div>
        );
    }
}

export default Counter;