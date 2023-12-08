import { useState, useEffect } from "react";
import EditableField from "./EditableField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from '../../utils/axios';

// id SERIAL PRIMARY KEY,
//     date TIMESTAMP,
//     time_start TIMESTAMP,
//     time_end TIMESTAMP,
//     event_type VARCHAR(250),  -- e.g. Technical Education/Personal Development
//     location VARCHAR(250),  -- can also be Zoom link
//     lesson_content_id INT REFERENCES lesson_content(id),  -- derive name of session from this+cohort
//     cohort_id INT REFERENCES cohort(id)


export default function SessionForm() {
  const [event, setEvent] = useState(["Saturday Session"]);
  const [location, setLocation] = useState("");
  const [cohort, setCohort] = useState([]);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("session");
        const cohorts = await axios.get("cohort");
        const lessons = await axios.get("lesson_content");
        setCohorts(cohorts.data.map(
          item => ({name: item.name, onselect: () => setSelectedCohort(item.id)})
        ));
        setLessons(lessons.data);
        setEvent(response.data.map((item) => item.event_type));
        setLocation(response.data.map((item) => item.location));
        //setCohort(cohorts.data.map((item) => item.name));
        setDescription(
          lessons.data.map(
            (item) =>
              `Module: ${item.module},\nWeek: ${item.module_week},\n link: ${item.syllabus_link}`
          )
        );
  //      [
//   {
//     id: 2,
//     date: "2023-12-05T23:02:48.797Z",
//     time_start: "2023-12-05T23:02:48.797Z",
//     time_end: "2023-12-05T23:02:48.797Z",
//     who_leading: "Barath",
//     cohort: "London 10",
//     city: "London",
//     location: "London",
//     module_name: "Databases",
//     module_week: 1,
//     syllabus_link: "codeyourfuture.com",
//   },
// ];
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  async function submitForm() {
    
    try {
      const response = await axios.post("/session", {
        date: startDate.split("T")[0],
        time_start: startDate.split("T")[1].split(".")[0],
        time_end: endDate.split("T")[1].split(".")[0],
        cohort_id: selectedCohort,
        location: location,
        event_type: event,
        lesson_content_id: selectedLesson,

      });
    } catch (error) {
      console.log(error);
    }
    
  }

  //const [inputValue, setInputValue] = useState("Saturday Session");
  // const handleInputChange = (e) => {
  //   setInputValue(e.target.value);
  // };

  return (
    <div className="formDiv">
      <form onSubmit={submitForm}>
        <h2>Calendar Event</h2>
        <label className="form-label">
          {" "}
          Event<br></br>
          <EditableField name="event" type="text" options={event} />
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
          <EditableField name="location" type="text" options={location} />
        </label>
        <label className="form-label">
          {" "}
          Cohort<br></br>
          <EditableField name="cohort" type="text" options={cohort} />
        </label>
        <label className="form-label">
          {" "}
          Lesson Description
          <br></br>
          <EditableField name="description" type="text" options={description} />
        </label>
      </form>
      <button type="submit" onClick={submitForm}>
        Create/Update
      </button>
    </div>
  );
}
