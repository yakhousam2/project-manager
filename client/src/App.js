import React, { useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState({ id: "", username: "" });
  const handleClick = async () => {
    try {
      const res = await fetch("api/getuserinfos");
      console.log(res)
      const json = await res.json();
      console.log(json)
      const {id, username} = json
      setUser({id, username})
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div>
      <h1>Get user info</h1>
      <button onClick={handleClick}>Click me!</button>
      <h2>id: {user.id}</h2>
      <h2>username: {user.username}</h2>
      <a href='/logout'>Logout (work only in production mode)</a>
    </div>
  );
}

export default App;
