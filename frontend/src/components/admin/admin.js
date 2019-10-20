import React from 'react';
import styles from './admin.module.css';
import socketIOClient from "socket.io-client";
import Loader from "react-loader-spinner";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            password: '',
            loggingIn: false,
            loggedIn: false,
            requestTypes: null,
            counters: null
        };
    }

    componentDidMount() {
        // URL to call socketIO backend
        const endpoint = 'ws://localhost:8080';
        // Sets socket with callback to setup (to wait for the async state change)
        this.setState({
            socket: socketIOClient(endpoint)
        }, () => this.setup());
    }

    setup() {
        this.state.socket.on('loginSuccessful', this.loginSuccessful.bind(this));
        this.state.socket.on('adminInfos', this.receiveAdminInfos.bind(this));
    }

    login(password) {
        this.setState({
            loggingIn: true,
        });
        this.state.socket.emit('join', {
            role: 'admin',
            password
        })
    }

    loginSuccessful() {
        this.setState({
           loggedIn: true
        });
        this.getAdminInfos();
    }

    getAdminInfos() {
        this.state.socket.send({
            command: 'getAdminInfos'
        });
    }

    receiveAdminInfos(data) {
        this.setState({
            requestTypes: data.requestTypes,
            counters: data.counters
        });
    }

    render() {
        return (
            <div className={styles.container}>
                {!this.state.loggingIn && (
                    <div className={styles.loginContainer}>
                        <h1>Authorization required</h1>
                        <p>Access to the admin dashboard is protected by password. Please authenticate.</p>
                        <input className={styles.passwordInput} type="password"
                               onChange={(e) => this.setState({password: e.target.value})}/>
                        <button onClick={() => this.login(this.state.password)}>login</button>
                    </div>
                )}
                {this.state.loggingIn === true && this.state.loggedIn === false &&(
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}>
                            <Loader type="TailSpin" color="#444" height={50} width={50}/>
                        </div>
                    </div>
                )}
                {this.state.loggedIn === true && (
                    <div className={styles.container}>
                        <p>Placeholder for admin panel</p>
                    </div>
                )}
            </div>
        );
    }
}

export default Admin;