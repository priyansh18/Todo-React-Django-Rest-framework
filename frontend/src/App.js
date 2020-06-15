import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    todoList: [],
    activeItem: {
      id: null,
      title: "",
      completed: false,
    },
    editing: false,
  };
  componentWillMount() {
    this.fetchTask();
  }

  fetchTask = () => {
    console.log("Fetching");

    fetch("http://127.0.0.1:8000/api/task-list/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data:", data);
        this.setState({
          todoList: data,
        });
      });
  };
  render() {
    var tasks = this.state.todoList;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    className="form-control"
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Add Task"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    className="btn btn-warning"
                    id="submit"
                    type="submit"
                    name="submit"
                    placeholder="Add Task"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="list-wrapper">
            {tasks.map((task, index) => (
              <div key={index} className="task-wrapper flex-wrapper">
                <div style={{ flex: 7 }}>
                  <span>{task.title}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <button className="btn btn-sm btn-outline-info edit">Edit</button>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-dark delete">-</button> 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
