import React, { Component } from "react";
import { NavLink } from "react-router-dom";
const elements = ["one", "two", "three"];

const rooms = [];
elements.forEach(function(element) {
  rooms.push(<p>{element}</p>);
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localStorage: ""
    };
  }
  componentDidMount() {
    let message = localStorage.getItem("message");
    this.setState({ localStorage: message });
  }
  clickHandler = event => {
    event.preventDefault();
    alert("This button works, but doesnt do anything yet");

    localStorage.setItem("message", "we set local storage");
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
