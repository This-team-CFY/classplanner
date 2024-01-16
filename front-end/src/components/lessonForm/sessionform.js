import { useState, useEffect } from "react";
import EditableField from "./EditableField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from '../../utils/axios';

export default function SessionForm() {
  const [sessionData, setSessionData] = useState([{}]);
  const [cohortData, setCohortData] = useState([{}]);
  const [lessonData, setLessonData] = useState([{}])
  const [event, setEvent] = useState(["Saturday Session"]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [cohort, setCohort] = useState([]);
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  
  const handleSelectEvent = (selectedValue) => {
    setEvent(selectedValue);
  };

  const handleSelectLocation = (selectedValue) => {
    setLocation(selectedValue);
  };  

  const handleSelectCohort = (selectedValue) => {
    let cohortId = cohortData.find(item => item.name === selectedValue);
    setCohort(cohortId ? cohort.id: 1);
  };  

  const handleSelectDescription = (selectedValue) => {
    let lesson = lessonData.find(
      item => (
        selectedValue.includes(item.module) &&
        selectedValue.includes(item.module_week) &&
        selectedValue.includes(item.syllabus_link)
    ));
    
    setDescription(lesson ? lesson.id : null);
    setSummary(selectedValue);
    console.log(selectedValue)
  };  

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("session");
        const cohorts = await axios.get("cohort");
        const lessons = await axios.get("lesson_content");
        setSessionData(response.data);
        setCohortData(cohorts.data);
        setLessonData(lessons.data);
    } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  async function submitForm() {
    
    let sessionInfo = {
      date: JSON.stringify(startDate).split("T")[0],
      time_start: JSON.stringify(startDate).split("T")[1].split(".")[0],
      start_time: startDate,
      end_time: endDate,
      time_end: JSON.stringify(endDate).split("T")[1].split(".")[0],
      cohort_id: cohort,
      location: location,
      event_type: event,
      lesson_content_id: description,
      summary: summary,
    };
    
    try {
      const response = await axios.post("/session", sessionInfo);
    } catch (error) {
      console.log(error);
    }
    try {
      const calendarEvent = await axios.post("create-event", sessionInfo);
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <div className="formDiv">
      <form onSubmit={submitForm}>
        <h2>Calendar Event</h2>
        <label className="form-label">
          {" "}
          Event<br></br>
          <EditableField
            name="event"
            type="text"
            options={sessionData.map((item) => item.event_type)}
            onSelectChange={handleSelectEvent}
          />
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
          <EditableField
            name="location"
            type="text"
            options={sessionData.map((item) => item.location)}
            onSelectChange={handleSelectLocation}
          />
        </label>
        <label className="form-label">
          {" "}
          Cohort<br></br>
          <EditableField
            name="cohort"
            type="text"
            options={cohortData.map((item) => item.name)}
            onSelectChange={handleSelectCohort}
          />
        </label>
        <label className="form-label">
          {" "}
          Lesson Description
          <br></br>
          <EditableField
            name="description"
            type="text"
            options={lessonData.map(
              (item) =>
                `Module: ${item.module},\nWeek: ${item.week_no},\n link: ${item.syllabus_link}`
            )}
            onSelectChange={handleSelectDescription}
          />
        </label>
      </form>
      <button type="submit" onClick={submitForm}>
        Create/Update
      </button>
    </div>
  );
}
