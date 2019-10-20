import React, {Component} from 'react';
import Loader from 'react-loader-spinner';

import styles from './styles.module.css';
import socketIOClient from "socket.io-client";

class Ticket extends Component {
    state = {
        socket: null,
        ticket: null,
        service: null,
        requesting: false,

        myTurnAtCounter: null
    };

    requestTicket(type) {
        this.state.socket.send({
            command: 'getTicket',
            info: {
                requestType: type
            }
        });
        this.setState({
            service: type,
            requesting: true
        });
    }

    ticketGenerated(ticket) {
        this.setState({ ticket });
    }

    serving(data) {
        if(data.code === this.state.ticket.code)
            this.setState({ myTurnAtCounter: data.counter });
    }

    estimatedTimeChanged(data) {
        this.setState({
            ticket: Object.assign(this.state.ticket, { estimatedTime: data.estimatedTime })
        })
    }

    login() {
        this.state.socket.emit('join', {
            role: 'customer'
        });
    }

    setup() {
        this.login();

        this.state.socket.on('ticketGenerated', this.ticketGenerated.bind(this));
        this.state.socket.on('serving', this.serving.bind(this));
        this.state.socket.on('estimatedTimeChanged', this.estimatedTimeChanged.bind(this));
    }

    componentDidMount() {
        const endpoint = 'ws://localhost:8080';
        this.setState({
            socket: socketIOClient(endpoint)
        }, () => this.setup());
    }

    render() {
        return(
            <div className={styles.container}>
                {this.state.ticket === null && this.state.requesting === false && (
                    <div className={styles.requestContainer}>
                        <h1>Select a service</h1>
                        <button onClick={() => this.requestTicket('accounts')}>accounts</button>
                        <button onClick={() => this.requestTicket('packages')}>packages</button>
                    </div>
                )}
                {this.state.ticket === null && this.state.requesting === true && (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}>
                            <Loader type="TailSpin" color="#444" height={50} width={50} />
                        </div>
                    </div>
                )}
                {this.state.ticket !== null && (
                    <div className={styles.ticketContainer}>
                        <h1>Your ticket</h1>
                        <p>Selected service: <span className={styles.tag}>{this.state.service}</span></p>
                        <h1 className={styles.servedTicket}>{this.state.ticket.code}</h1>
                        <p className={styles.datetime}>{new Date(this.state.ticket.datetime).toLocaleString()}</p>
                        {this.state.myTurnAtCounter === null ? (
                            <p className={styles.estimatedTime}>estimated waiting time: <b>{this.state.ticket.estimatedTime} minutes</b></p>
                        ) : (
                            <div className={styles.info}>
                                <p className={styles.estimatedTime}><b>YOUR TURN</b></p>
                                <p><b>counter {this.state.myTurnAtCounter}</b></p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default Ticket;