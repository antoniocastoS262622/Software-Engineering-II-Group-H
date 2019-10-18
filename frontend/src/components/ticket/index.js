import React, {Component} from 'react';

import styles from './styles.module.css';

class Ticket extends Component {
    state = {
        requestedTicket: null
    };

    requestTicket(type){
        this.props.socket.send({
            command: 'getTicket',
            info: {
                requestType: type
            }
        });
        this.setState({
            requestedTicket: type
        });
    }
    ticketGenerated(ticket) {
        this.setState({
            ticket
        });
    }
    serving() {
        
    }
    login() {
        this.props.socket.emit('join', {
            role: 'customer'
        });
    }
    setup() {
        this.login();
        this.props.socket.on('ticketGenerated', this.ticketGenerated.bind(this));
        this.props.socket.on('serving', this.serving.bind(this));
    }

    componentDidMount() {
        this.setup();
    }
    render() {
        return(
            <div>
                {this.state.ticket && (
                    <div>
                        <h1>Your ticket</h1>
                        <br/>
                        <div className={styles.ticketWrapper}>
                            <div className={styles.ticketHeader}>
                                <p id={styles.ticketService}>Service choosen:<br></br>
                                    {this.state.requestedTicket}</p>
                            </div>
                            <div className={styles.ticketNumberWrapper}>
                                <p id={styles.ticketNumber}>{this.state.ticket.code}</p>
                            </div>
                            <div className={styles.ticketStatistics}>
                                <p id={styles.ticketService}>Estimated time: <br></br>20 min.<br></br>
                                Timestamp:<br></br>
                                {this.state.ticket.datetime}</p>
                            </div>
                        </div>
                    </div>
                )}
                {this.state.requestedTicket === null && (
                    <div>
                        <button onClick={() => this.requestTicket('packages')}>Packaging</button>
                        <button onClick={() => this.requestTicket('accounts')}>Accounting</button>
                    </div>
                )}
            </div>
        );
    }
}

export default Ticket;