// client/src/components/DisasterList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function DisasterList() {
  const [disasters, setDisasters] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/disasters")
      .then((response) => {
        console.log(response.data); // Check if data is coming correctly
        setDisasters(response.data);
      })
      .catch((error) => console.error("Error fetching disasters:", error));
  }, []);

  return (
    <div>
      <h1>Disaster List</h1>
      {disasters.length === 0 ? (
        <p>No disasters to display.</p> // This shows if no disasters are fetched
      ) : (
        <ul>
          {disasters.map((disaster) => (
            <li key={disaster._id}>
              <h2>{disaster.name}</h2>
              <p>{disaster.location}</p>
              <p>{disaster.description}</p>
              <p>Severity: {disaster.severity}</p>
              <p>Date: {new Date(disaster.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DisasterList;
