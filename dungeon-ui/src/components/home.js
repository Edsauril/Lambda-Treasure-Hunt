import React, { Component } from "react";
import axios from "axios";
const auth = "Token 666c863bbf493d100e6c1ad9125d2f6265199310";
let traversalPath = [];
let graph = {};
let visited = [];
let currentExits = [];
let currentRoom = "";
let escape = [];
let route = "";
let escapeRoute = "";
let i = 0;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localStorage: "",
      map: "",
      currentRoom: "",
      exits: []
    };
  }
  componentDidMount() {
    axios
      .get("https://lambda-treasure-hunt.herokuapp.com/api/adv/init", {
        headers: { Authorization: auth }
      })
      .then(res => {
        console.log(res);
        this.setState({ currentRoom: res.data.room_id });
        this.setState({ exits: res.data.exits });
      })
      .catch(error => console.log(error));
    let message = localStorage.getItem("message");
    this.setState({ localStorage: message });
  }

  move = direction => {
    axios
      .post(
        "https://lambda-treasure-hunt.herokuapp.com/api/adv/move/",
        { direction: direction },
        { headers: { Authorization: auth } }
      )
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  moveNorth = event => {
    event.preventDefault();
    console.log("click");
    window.setTimeout(() => this.move("n"), 15000);
  };

  traversal = () => {
    console.log("start");
    console.log("iter");
    currentRoom = this.state.currentRoom;
    currentExits = this.state.exits;
    console.log("Room: " + currentRoom);
    console.log("Exits: " + currentExits);
    if (i > 10) {
      return console.log("finished");
    }
    if (!visited.includes(currentRoom)) {
      visited.push(currentRoom);
    }
    if (!(currentRoom in graph)) {
      currentExits = this.state.exits;
    } else {
      currentExits = graph[currentRoom];
    }
    graph[currentRoom] = currentExits;
    if (route) {
      if (route === "n") {
        if (graph[currentRoom].includes("s")) {
          graph[currentRoom].splice(graph[currentRoom].indexOf("s"), 1);
        }
        escape.push("s");
      }
      if (route === "e") {
        if (graph[currentRoom].includes("w")) {
          graph[currentRoom].splice(graph[currentRoom].indexOf("w"), 1);
        }
        escape.push("w");
      }
      if (route === "s") {
        if (graph[currentRoom].includes("n")) {
          graph[currentRoom].splice(graph[currentRoom].indexOf("n"), 1);
        }
        escape.push("n");
      }
      if (route === "w") {
        if (graph[currentRoom].includes("e")) {
          graph[currentRoom].splice(graph[currentRoom].indexOf("e"), 1);
        }
        escape.push("e");
      }
    }
    if (graph[currentRoom]) {
      route =
        graph[currentRoom][
          Math.floor(Math.random() * graph[currentRoom].length)
        ];
      graph[currentRoom].splice(graph[currentRoom].indexOf(route), 1);
      traversalPath.push(route);
      console.log(route);
      this.move(route);
    } else {
      console.log("!!escape!!");
      escapeRoute = escape.pop();
      traversalPath.push(escapeRoute);
      this.move(escapeRoute);
      route = "";
    }
    setTimeout(() => this.traversal(), 30000);
  };

  clickHandler = event => {
    event.preventDefault();
    traversalPath = [];
    graph = {};
    visited = [];
    currentExits = [];
    currentRoom = "";
    escape = [];
    route = "";
    escapeRoute = "";
    i = 0;
    this.traversal();
  };

  render() {
    return (
      <div className="home">
        <h1>MAP</h1>
        <button onClick={this.clickHandler}>Explore</button>
        <p>{this.state.localStorage}</p>
        <button onClick={this.moveNorth}>Move North</button>
      </div>
    );
  }
}

export default Home;
