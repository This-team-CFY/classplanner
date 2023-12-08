import { useState, useEffect } from "react";
import EditableField from "./EditableField";
import axios from '../../utils/axios';


export default function LessonForm() {
  const [module_no, setModule_no] = useState([]);
  const [module, setModule] = useState([]);
  const [week_no, setWeek_no] = useState([]);
  const [topic, setTopic] = useState([]);
  const [link, setLink] = useState([]);

  const [module_field, setModule_field] = useState("")
  const [module_no_field, setModule_no_field] = useState("");
  const [week_no_field, setWeek_no_field] = useState("");
  const [lesson_topic_field, setLesson_topic_field] = useState("");
  const [syllabus_link_field, setSyllabus_link_field] = useState("");

  useEffect(() => {
    async function fetchData () {
      try {
      const response = await axios.get("lesson_content");
      setModule_no(response.data.map((item) => item.module_no));
      setModule(response.data.map(item => item.module));
      setWeek_no(response.data.map(item => item.week_no));
      setTopic(response.data.map(item => item.lesson_topic));
      setLink(response.data.map(item => item.syllabus_link));
      }
      catch (error){
        console.log(error)
      }
    }
    fetchData();
  }, [])
  

  async function submitForm(data) {
    console.log("Form submitted");
       console.log(data)
    try{

    const response = await axios.post("/lesson_content", {
      module: module_field,
      module_no: module_no_field,
      week_no: week_no_field,
      lesson_topic: lesson_topic_field,
      syllabus_link: syllabus_link_field,
    });
    }
    catch (error){
      console.log(error)
    }
  }

  return (
    <div className="formDiv">
      <form onSubmit={submitForm}>
        <h2>Lesson Content</h2>
        <label className="form-label">
          {" "}
          Module №<br></br>
          <EditableField setField={setModule_no_field}  name="module_no" type="number" options={module_no} />
        </label>
        <label className="form-label">
          {" "}
          Module<br></br>
          <EditableField setField= {setModule_field} name="Module" type="text" options={module} />
        </label>
        <label className="form-label">
          {" "}
          Week №<br></br>
          <EditableField setField={setWeek_no_field} name="week_no" type="number" options={week_no} />
        </label>
        <label className="form-label">
          {" "}
          Lesson Topic<br></br>
          <EditableField setField={setLesson_topic_field} name="lesson_topic" type="text" options={topic} />
        </label>
        <label className="form-label">
          {" "}
          Syllabus Link<br></br>
          <EditableField setField={setSyllabus_link_field} name="syllabus_link" type="text" options={link} />
        </label>
      </form>
      <button type="submit" onClick={submitForm}>
        Create/Update
      </button>
    </div>
  );
}
