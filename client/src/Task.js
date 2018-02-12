import React, { Component } from 'react';
import './Task.css';

class Task extends Component {

    state: {
        task: {}
    }

    constructor(props) {
        super(props);
    }

    removeMe = () => {
        this.props.removeTask(this.props.task._id);
    }

    render() {
        return (
            <div className="rowStyle" style={{background: this.props.task.color}}>
                <div className="cellStyle"> {this.props.task.name} </div>
                <div className="cellStyle"> {this.props.task.priority} </div>
                <div className="cellStyle"> {this.props.task.category} </div>
                <div className="cellStyle">
                    <div className="buttonStyle" onClick={this.removeMe}>-</div>
                </div>
            </div>
        )
    }
}

export default Task;
