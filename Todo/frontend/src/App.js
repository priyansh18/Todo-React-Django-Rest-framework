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

  getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
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
  handleChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name", name);
    console.log("Value", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Item", this.state.activeItem);

    var csrftoken = this.getCookie("csrftoken");

    var url = "http://127.0.0.1:8000/api/task-create/";
    if (this.state.editing === true) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;
      this.setState({
        editing: false,
      });
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((response) => {
        this.fetchTask();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
          },
        });
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  startEdit = (task) => {
    this.setState({
      activeItem: task,
      editing: true,
    });
  };

  deleteItem = (task) => {
    var csrftoken = this.getCookie("csrftoken");

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    }).then((response) => {
      this.fetchTask();
    });
  };

  strikeUnstrike = (task) => {
    task.completed = !task.completed;

    console.log("Strike", task.completed);
    var csrftoken = this.getCookie("csrftoken");

    fetch(`http://127.0.0.1:8000/api/task-update/${task.id}/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ completed: task.completed, title: task.title }),
    }).then((response) => {
      this.fetchTask();
    });
  };
  render() {
    var tasks = this.state.todoList;
    var self = this;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    className="form-control"
                    id="title"
                    value={this.state.activeItem.title}
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
                <div
                  onClick={() => self.strikeUnstrike(task)}
                  style={{ flex: 7 }}
                >
                  {task.completed == false ? (
                    <span>{task.title}</span>
                  ) : (
                    <strike>{task.title}</strike>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <button
                    onClick={() => self.startEdit(task)}
                    className="btn btn-sm btn-outline-info edit"
                  >
                    Edit
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => self.deleteItem(task)}
                    className="btn btn-sm btn-outline-dark delete"
                  >
                    -
                  </button>
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
