import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
const elements = ["one", "two", "three"];
const auth = "Token 666c863bbf493d100e6c1ad9125d2f6265199310";
const rooms = [];
elements.forEach(function(element) {
  rooms.push(<p>{element}</p>);
});

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
  clickHandler = event => {
    event.preventDefault();
    localStorage.setItem("message", "we set local storage");
    let traversalPath = [];
    let graph = {};
    let visited = [];
    let currentExits = [];
    let currentRoom = "";
    let escape = [];
    let route = "";
    let i = 0;
    let escapeRoute = "";
    console.log("start");
    while (i < 5) {
      console.log("iter");
      currentRoom = this.state.currentRoom;
      currentExits = this.state.exits;
      console.log("Room: " + currentRoom);
      console.log("Exits: " + currentExits);
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
        axios
          .post(
            "https://lambda-treasure-hunt.herokuapp.com/api/adv/move/",
            {
              direction: route
            },
            { Authorization: auth }
          )
          .then(res => {
            console.log(res);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        console.log("!!escape!!");
        escapeRoute = escape.pop();
        traversalPath.push(escapeRoute);
        axios
          .post(
            "https://lambda-treasure-hunt.herokuapp.com/api/adv/move/",
            {
              direction: escapeRoute
            },
            { Authorization: auth }
          )
          .then(res => {
            console.log(res);
          })
          .catch(error => {
            console.log(error);
          });
        route = "";
      }

      console.log(visited.length);
      i++;
    }

    // # go through an exit
    //     if graph[currentRoom]:
    //         route = random.choice(graph[currentRoom])
    //         graph[currentRoom].remove(route)
    //         print(route)
    //         traversalPath.append(route)
    //         player.travel(route)
    //     else:
    //         print("!!escape!!")
    //         escapeRoute = (escape.pop())
    //         print(escapeRoute[-1])
    //         traversalPath.append(escapeRoute)
    //         player.travel(escapeRoute)
    //         route = None

    //     i+=1
  };

  render() {
    return (
      <div className="home">
        <h1>MAP</h1>
        <button onClick={this.clickHandler}>Explore</button>
        {rooms}
        <p>{this.state.localStorage}</p>
      </div>
    );
  }
}

export default Home;
