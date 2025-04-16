// client/src/components/AddDisaster.js
import React, { useState } from "react";
import axios from "axios";

function AddDisaster() {
  const [disaster, setDisaster] = useState({
    name: "",
    location: "",
    description: "",
    severity: "",
    date: new Date(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisaster((prevDisaster) => ({
      ...prevDisaster,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/disasters", disaster)
      .then((response) => {
        console.log("Disaster added:", response.data);
      })
      .catch((error) => {
        console.error("Error adding disaster:", error);
      });
  };

  return (
    <div className="container">
      <div className="add-disaster-form">
        <h2>Add Disaster</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={disaster.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={disaster.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={disaster.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="severity">Severity:</label>
            <select
              id="severity"
              name="severity"
              value={disaster.severity}
              onChange={handleChange}
              required
            >
              <option value="">Select Severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button type="submit">Add Disaster</button>
        </form>
      </div>
    </div>
  );
}

export default AddDisaster;
