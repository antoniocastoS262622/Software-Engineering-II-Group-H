import React from 'react';
import styles from './admin.module.css';
import {FaTrash} from 'react-icons/fa';

export default class Counter extends React.Component {
    render() {
        return (
            <div className={styles.counterContainer}>
                <span className={styles.deleteButton}><FaTrash /></span>
                <p>COUNTER #{this.props.id}</p>
                <span className={styles.tag}>test</span>
                <span className={styles.tagDisabled}>test</span>
            </div>
        );
    }
}