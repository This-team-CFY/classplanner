import { useState, useEffect, useRef } from "react";
import EditableField from "./EditableField";
import axios from '../../utils/axios';


export default function LessonForm() {
  const [dataArray, setDataArray] = useState([
    {
      module: "HTML/CSS",
      module_no: 1,
      week_no: 2,
      lesson_topic: "DOM structure",
      syllabus_link: "thankyou.com",
    },
  ]);
  const [module_no, setModule_no] = useState(null);
  const [module, setModule] = useState(null);
  const [week_no, setWeek_no] = useState(null);
  const [topic, setTopic] = useState(null);
  const [link, setLink] = useState(null);
  
  const handleSelectModuleNo = (selectedValue) => {
    setModule_no(selectedValue);
  };

  const handleSelectModule = (selectedValue) => {
    setModule(selectedValue);
  };

  const handleSelectWeekNo = (selectedValue) => {
    setWeek_no(selectedValue);
  };

  const handleSelectTopic = (selectedValue) => {
    setTopic(selectedValue);
  };

  const handleSelectLink = (selectedValue) => {
    setLink(selectedValue);
  };

  useEffect(() => {
    async function fetchData () {
      try {
      const response = await axios.get("lesson_content");
      console.log(response.data)
      setDataArray(response.data)
     }
      catch (error){
        console.log(error)
      }
    }
    fetchData();
  }, [])
  

  async function submitForm() {
    
    try{
      const response = await axios.post("/lesson_content", {
        module: module,
        module_no: parseInt(module_no),
        week_no: parseInt(week_no),
        lesson_topic: topic,
        syllabus_link: link
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
          <EditableField
            name="module_no"
            type="number"
            options={dataArray.map(item => item.module_no)}
            onSelectChange={handleSelectModuleNo}
          />
        </label>
        <label className="form-label">
          {" "}
          Module<br></br>
          <EditableField
            name="Module"
            type="text"
            options={dataArray.map(item => item.module)}
            onSelectChange={handleSelectModule}
          />
        </label>
        <label className="form-label">
          {" "}
          Week №<br></br>
          <EditableField
            name="week_no"
            type="number"
            options={dataArray.map(item => item.week_no)}
            onSelectChange={handleSelectWeekNo}
          />
        </label>
        <label className="form-label">
          {" "}
          Lesson Topic<br></br>
          <EditableField
            name="lesson_topic"
            type="text"
            options={dataArray.map(item => item.lesson_topic)}
            onSelectChange={handleSelectTopic}
          />
        </label>
        <label className="form-label">
          {" "}
          Syllabus Link<br></br>
          <EditableField
            name="syllabus_link"
            type="text"
            options={dataArray.map(item => item.syllabus_link)}
            onSelectChange={handleSelectLink}
          />
        </label>
      </form>
      <button type="submit" onClick={submitForm}>
        Create/Update
      </button>
    </div>
  );
}
