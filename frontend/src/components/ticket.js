import React from 'react';
import styles from './styles/ticket-style.module.css';

class Ticket extends React.Component {
    render(){
        return(
            <div>
                <h1>Your ticket</h1>
                <br/>
                <div className={styles.ticketWrapper}>
                    <div className={styles.ticketHeader}>
                        <p id={styles.ticketService}>Service choosen:<br></br>
                            ACCOUNTING</p>
                    </div>
                    <div className={styles.ticketNumberWrapper}>
                        <p id={styles.ticketNumber}>P28</p>
                    </div>
                    <div className={styles.ticketStatistics}>
                        <p id={styles.ticketService}>Estimated time: <br></br>20 min.<br></br>
                        Timestamp:<br></br>
                        19:32 17/10/2019</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Ticket;