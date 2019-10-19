import React, {Component} from 'react';
import { Textfit } from 'react-textfit';

import styles from './styles.module.css';

class Board extends Component {
    state = {
    };

    serving() {
        
    }

    login() {
        this.props.socket.emit('join', {
            role: 'board'
        });
    }

    setup() {
        this.login();

        this.props.socket.on('serving', this.serving.bind(this));
    }

    componentDidMount() {
        this.setup();
    }
    
    render() {
        const text = (text, flex, color) => (
            <Textfit mode="multi" max={200} style={{ flex, textAlign: 'center', color }}>{text}</Textfit>
        );

        return(
            <div className={styles.container}>
                <div className={styles.boardContainer}>
                    <div className={styles.headerContainer}>
                        <p>ticket</p>
                        <p>sportello</p>
                    </div>
                    <div className={styles.lineContainer}>
                        {text('A001', 7, '#b73131')}
                        {text('04', 5, '#2f962d')}
                    </div>
                    <div className={styles.lineContainer}>
                        {text('A001', 7, '#b73131')}
                        {text('04', 5, '#2f962d')}
                    </div>
                    <div className={styles.lineContainer}>
                        {text('A001', 7, '#b73131')}
                        {text('04', 5, '#2f962d')}
                    </div>
                </div>
            </div>
        );
    }
}

export default Board;