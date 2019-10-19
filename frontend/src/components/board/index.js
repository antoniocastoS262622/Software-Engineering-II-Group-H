import React, {Component} from 'react';
import { Textfit } from 'react-textfit';

import styles from './styles.module.css';

class Board extends Component {
    state = {
        current: {}
    };

    getCurrentSituation() {
        this.props.socket.send({
            command: 'getCurrentSituation'
        });
    }

    loginSuccessful() {
        this.getCurrentSituation();
    }

    updateCurrentSituation(data) {
        let current = {};
        Object.keys(data).forEach(key => {
            current[key] = {
                code: data[key],
                datetime: new Date()
            };
        })
        this.setState({ current });
    }

    serving(data) {
        this.setState({
            current: Object.assign(this.state.current, {
                [data.counter]: {
                    code: data.code,
                    datetime: new Date()
                }
            })
        });
    }

    login() {
        this.props.socket.emit('join', {
            role: 'board'
        });
    }

    setup() {
        this.login();

        this.props.socket.on('loginSuccessful', this.loginSuccessful.bind(this));
        this.props.socket.on('currentSituation', this.updateCurrentSituation.bind(this));
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
                        <p>TICKET</p>
                        <p>COUNTER</p>
                    </div>
                    {Object.keys(this.state.current).sort((a, b) => this.state.current[b].datetime - this.state.current[a].datetime).map(key => (
                        <div className={styles.lineContainer}>
                            {text(this.state.current[key].code, 7, '#b73131')}
                            {text(('0' + key).slice(-2), 5, '#2f962d')}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Board;