import React, {useState} from "react";
import "./../../src/styles/Toolbar.css";

const Toolbar = () => {
  const [selectedCity, setSelectedCity] = useState("London"); //set the default value of user
  const cities = [
    "London",
    "Glasgow",
    "North West",
    "South Africa",
    "West Midlands",
    "Virtual",
  ];

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  return (
    <div className="toolbar">
      <label htmlFor="cityDropdown">Select City: </label>
      <select
        id="cityDropdown"
        value={selectedCity}
        onChange={(e) => handleCityChange(e.target.value)}
      >
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <p>Selected City: {selectedCity}</p>
    </div>
  );
};

export default Toolbar;
