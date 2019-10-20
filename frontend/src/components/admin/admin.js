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
            loggingIn: false
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

    }

    render() {
        return(
            <div className={styles.container}>
                {!this.state.loggingIn && (
                    <div className={styles.loginContainer}>
                        <h1>Authorization required</h1>
                        <p>Access to the admin dashboard is protected by password. Please authenticate.</p>
                        <input className={styles.passwordInput} type="password" onChange={(e) => this.setState({ password: e.target.value })} />
                        <button onClick={() => this.login}>login</button>
                    </div>
                )}
                {this.state.loggingIn === true && (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}>
                            <Loader type="TailSpin" color="#444" height={50} width={50} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Admin;