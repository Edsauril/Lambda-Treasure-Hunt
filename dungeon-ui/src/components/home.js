import React, { Component } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import "./home.css";

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
let persMap = {};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localStorage: "",
      map: "",
      currentRoom: "",
      exits: [],
      cooldown: null,
      coords: "",
      description: "",
      error: ""
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
        this.setState({ cooldown: res.data.cooldown });
        this.setState({ coords: res.data.coordinates });
        this.setState({ description: res.data.description });
        this.setState({ error: res.data.errors });
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
        console.log("movement to " + direction + " succesful");
        this.setState({ currentRoom: res.data.room_id });
        this.setState({ exits: res.data.exits });
        this.setState({ cooldown: res.data.cooldown });
        this.setState({ coords: res.data.coordinates });
        this.setState({ description: res.data.description });
        this.setState({ error: res.data.errors });
      })
      .catch(error => {
        console.log(error);
      });
  };

  moveNorth = event => {
    event.preventDefault();
    console.log("click");
    this.move("n");
  };
  moveSouth = event => {
    event.preventDefault();
    console.log("click");
    this.move("s");
  };
  moveWest = event => {
    event.preventDefault();
    console.log("click");
    this.move("w");
  };
  moveEast = event => {
    event.preventDefault();
    console.log("click");
    this.move("e");
  };

  traversal = () => {
    console.log("start");
    console.log("iter");
    currentRoom = this.state.currentRoom;
    currentExits = this.state.exits;
    console.log("Rooms found: " + visited.length);
    console.log("Room: " + currentRoom);
    console.log("Exits: " + currentExits);
    console.log("escape route: " + escape);
    if (visited.length >= 500) {
      console.log("visited: " + visited);
      console.log("length: " + visited.length);
      localStorage.setItem("map", JSON.stringify(persMap));
      return console.log("finished in " + i + " moves");
    }
    if (!visited.includes(currentRoom)) {
      visited.push(currentRoom);
    }
    if (!(currentRoom in graph)) {
      let mapValue = this.state.exits;
      mapValue.unshift(this.state.coords);
      persMap[currentRoom] = mapValue;
      console.log("persmap: " + JSON.stringify(persMap));
      currentExits = this.state.exits;
    } else {
      currentExits = graph[currentRoom];
    }
    console.log("maybe its here: " + currentExits);
    currentExits = currentExits.filter(element => element.length === 1);
    console.log("spliced currentExits: " + currentExits);
    graph[currentRoom] = currentExits;
    console.log("Checking... " + graph[currentRoom]);
    if (route) {
      if (route === "n") {
        if (graph[currentRoom].includes("s")) {
          graph[currentRoom] = graph[currentRoom].filter(
            element => element !== "s"
          );
        }
        escape.push("s");
      }
      if (route === "e") {
        if (graph[currentRoom].includes("w")) {
          graph[currentRoom] = graph[currentRoom].filter(
            element => element !== "w"
          );
        }
        escape.push("w");
      }
      if (route === "s") {
        if (graph[currentRoom].includes("n")) {
          graph[currentRoom] = graph[currentRoom].filter(
            element => element !== "n"
          );
        }
        escape.push("n");
      }
      if (route === "w") {
        if (graph[currentRoom].includes("e")) {
          graph[currentRoom] = graph[currentRoom].filter(
            element => element !== "e"
          );
        }
        escape.push("e");
      }
    }
    if (graph[currentRoom].length > 0) {
      console.log("looking for route from: " + graph[currentRoom]);
      route =
        graph[currentRoom][
          Math.floor(Math.random() * graph[currentRoom].length)
        ];
      console.log("found route: " + route);
      graph[currentRoom] = graph[currentRoom].filter(
        element => element !== route
      );
      console.log("new exits: " + JSON.stringify(graph[currentRoom]));
      console.log("new graph: " + JSON.stringify(graph));
      traversalPath.push(route);
      console.log("attempting move towards " + route);
      this.move(route);
    } else {
      console.log("!!escape!!");
      console.log("escape route: " + escape);
      escapeRoute = escape.pop();
      console.log("escape exit: " + escapeRoute);
      traversalPath.push(escapeRoute);
      this.move(escapeRoute);
      route = "";
    }
    i++;
    console.log(i + " " + visited);
    console.log("cooldown is: " + this.state.cooldown);
    console.log("waiting: " + (this.state.cooldown * 6000) / 1000 + " seconds");
    setTimeout(() => this.traversal(), this.state.cooldown * 6000);
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
    let map = persMap;
    let elements = [];
    for (let room in map) {
      let coords = map[room][0];
      coords = coords.slice(1, -1);
      coords = coords.split(",");
      elements.push({
        data: { id: room, label: room },
        position: { x: parseInt(coords[0]), y: parseInt(coords[1]) }
      });
    }

    return (
      <div className="home">
        <h1>MAP</h1>
        <div className="cy">
          <CytoscapeComponent
            zoom={5}
            pan={{ x: 50, y: 50 }}
            stylesheet={[
              {
                selector: "node",
                style: {
                  width: 1,
                  height: 1,
                  shape: "rectangle"
                }
              },
              {
                selector: "edge",
                style: {
                  width: ".25px"
                }
              }
            ]}
            elements={elements}
            style={{
              width: "100%",
              height: "100%"
            }}
          />
        </div>
        <button onClick={this.clickHandler}>Explore</button>
        <div className="message">
          <h3>Mystery Explorer</h3>
          <p>Description: {this.state.description}</p>
          <p>Exits: {this.state.exits}</p>
          <p>Items: {this.state.items}</p>
          <p>Notifcation: {this.state.errors}</p>
          <button onClick={this.moveNorth}>Move North</button>
          <button onClick={this.moveSouth}>Move South</button>
          <button onClick={this.moveEast}>Move East</button>
          <button onClick={this.moveWest}>Move West</button>
          <button>Pick up Treasure</button>
        </div>
      </div>
    );
  }
}

export default Home;
