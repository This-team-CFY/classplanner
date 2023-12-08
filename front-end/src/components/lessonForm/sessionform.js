import { useState, useEffect } from "react";
import EditableField from "./EditableField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from '../../utils/axios';


const module = ["HTML", "CSS", "JS1", "JS2", "JS3", "Node.js", "SQL"];
const lesson = [
  "HTML_link",
  "CSS_link",
  "JS1_link",
  "JS2_link",
  "JS3_link",
  "Node.js_link",
  "SQL_link",
];

export default function SessionForm() {
  async function submitForm() {
    console.log("Form submitted");
    const response = await axios.post("/session", {});
  }
  const [city, setCity] = useState([]);
  const [inputValue, setInputValue] = useState("Saturday Session");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const [location_field, setLocation_field] = useState("");
  const [city_field, setCity_field] = useState("");
  const [description_field, setDescription_field] = useState("");

useEffect(() => {
  // Simulate fetching data from the database
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/cities`
      );

      const data =response.data;
      setCity(data);
    } catch (error) {
      console.error("Error fetching city data:", error.message);
    }
  };

  fetchData(); // Call the fetchData function
}, []); // Empty dependency array ensures the effect runs once when the component mounts


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="formDiv">
      <form onSubmit={submitForm}>
        <h2>Calendar Event</h2>
        <label className="form-label">
          {" "}
          Event<br></br>
          <div className="input-line">
            <input
              type="text"
              name="event_name"
              value={inputValue}
              onChange={handleInputChange}
              autoFocus
            />
          </div>
        </label>
        <label className="form-label">
          Date
          <br />
          <div className="input-line">
            <label>Start:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              dateFormat="d MMM, h:mm aa"
              className="timepicker"
            />
            <label>End:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              dateFormat="d MMM, h:mm aa"
              className="timepicker"
            />
          </div>
        </label>
        <label className="form-label">
          {" "}
          Location<br></br>
          <input setField={setLocation_field} name="location" type="text" />
        </label>
        <label className="form-label">
          {" "}
          City(calendar)<br></br>
          <EditableField setField={setCity_field} optionsKey={"name"} optionsValue={'id'} name="city" type="text" options={city} />
        </label>
        <label className="form-label">
          {" "}
          Description
          <br></br>
          <EditableField setField={setDescription_field} name="description" type="text" options={lesson} />
        </label>
      </form>
      <button type="submit" onClick={submitForm}>
        Create/Update
      </button>
    </div>
  );
}
