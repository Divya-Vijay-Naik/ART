// client/src/App.js
import React from "react";
import DisasterList from "./components/DisasterList";
import AddDisaster from "./components/AddDisaster";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Disaster Management</h1>
      <AddDisaster />
      <DisasterList />
    </div>
  );
}

export default App;
