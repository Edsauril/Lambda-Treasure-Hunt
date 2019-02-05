import React from "react";
import { NavLink } from "react-router-dom";
const elements = ["one", "two", "three"];

const rooms = [];
elements.forEach(function(element) {
  rooms.push(<p>{element}</p>);
});
const Home = props => {
  return (
    <div className="home">
      <h1>MAP</h1>
      {rooms}
    </div>
  );
};

export default Home;
