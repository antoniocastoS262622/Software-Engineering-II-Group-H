import React, {Component} from 'react';

import styles from './styles';

class Counter extends Component {
    render() {
        const { id } = this.props.match.params

        return(
            <div>
                <h1>Counter {id}</h1>
            </div>
        );
    }
}

export default Counter;