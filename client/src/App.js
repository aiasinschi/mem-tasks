import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Task from './Task.js';

class App extends Component {

  state = {
      response: [],
      priorityColorMap: {
        0: '#FFFFFA',
        1: '#AAFFFF',
        2: '#BBDDAA',
        3: '#CCAA99',
        4: '#DDAA55',
        5: '#EE7799'
      },
      newTaskName: '',
      newTaskPriority: 0,
      newTaskCategory: ''
  }

  handleChangeName = (event) => {
      this.setState({newTaskName: event.target.value});
  }

  handleChangePriority = (event) => {
      this.setState({newTaskPriority: event.target.value});
  }

  handleChangeCategory = (event) => {
      this.setState({newTaskCategory: event.target.value});
  }

  resetNewTaskFields = () => {
      this.setState({
          newTaskName: '',
          newTaskPriority: 0,
          newTaskCategory: ''
      });
  }

  componentDidMount() {
    this.callApi()
      .then(res => {
        for (var i = 0; i < res.length; i++) {
            res[i].color = this.state.priorityColorMap[res[i].priority];
        }
        this.setState({ response: res });
      })
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('tasks');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  reloadApp() {
      this.componentDidMount();
  }

  addNewTask = async () => {
      const response = await fetch('tasks/add', {
          method: 'post',
          headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-type': 'application/json',
              'task': JSON.stringify({
                'name': this.state.newTaskName,
                'priority': this.state.newTaskPriority,
                'category': this.state.newTaskCategory
              })
          }
      });
      const body = await response.json();
      // maybe use the body somehow to inform the user about the result...
      if (response.status !== 200) throw Error(body.message);
      this.reloadApp();
      this.resetNewTaskFields();
      return body;
  }

  removeTask = async (id) => {
      const response = await fetch('tasks/delete', {
          method: 'post',
          headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-type': 'application/json',
              'id': id
          }
      });
      const body = await response.json();
      // maybe use the body somehow to inform the user about the result...
      if (response.status !== 200) throw Error(body.message);
      this.reloadApp();
      return body;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">T@sk manager</h1>
        </header>
        <div className="App-intro">
          <h3>Task list</h3>
          <div className="tableStyle">
            <div className="rowStyle">
                <div className="headerStyle"> Name </div>
                <div className="headerStyle"> Priority</div>
                <div className="headerStyle"> Category</div>
                <div className="headerStyle"> Action </div>
            </div>
          {this.state.response.map((function(task, index) {
                return <Task key={task._id} removeTask={this.removeTask} task={task}></Task>
                /*(
                    <div key={task._id} className="rowStyle" style={{background: task.color}}>
                        <div className="cellStyle"> {task.name} </div>
                        <div className="cellStyle"> {task.priority} </div>
                        <div className="cellStyle"> {task.category} </div>
                        <div className="cellStyle">
                           <div class="buttonStyle" onClick={this.removeTask(task._id)}>-</div>
                        </div>
                    </div>
                    )*/
            }).bind(this))}
          </div>
          <h3>Add new task</h3>
          <div className="tableStyle">
              <div className="rowStyle">
                <div className="headerStyle"> Name </div>
                <div className="headerStyle"> Priority</div>
                <div className="headerStyle"> Category</div>
              </div>
              <div className="rowStyle">
                  <div className="cellStyle">
                        <input type="text" value={this.state.newTaskName} onChange={this.handleChangeName}/>
                  </div>
                  <div className="cellStyle">
                        <input type="text" value={this.state.newTaskPriority} onChange={this.handleChangePriority}/>
                  </div>
                  <div className="cellStyle">
                        <input type="text" value={this.state.newTaskCategory} onChange={this.handleChangeCategory}/>
                  </div>
              </div>
          </div>
          <div className="buttonStyle" onClick={this.addNewTask}>Add</div>
        </div>
      </div>
    );
  }
}

export default App;
