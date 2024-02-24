import Navbar from "../components/barComponents/Navbar";
import LessonForm from "../components/lessonForm/lessonfrom";
import SessionForm from "../components/lessonForm/sessionform";

const Create = () => {


  return (
    <>
      <Navbar />
      <div className="general-form-container" style={{ marginTop: "250px" }}>

        <div className="form-container">
          <LessonForm />
        </div>
        <div className="form-container">
          <SessionForm />
        </div>

        <div >
          <iframe
            title="calendar"
            src="https://calendar.google.com/calendar/embed?src=4c572a675834bb44f3c7a1cd40456214e4a2a75fa67a890e40212effcd7d9989%40group.calendar.google.com&ctz=Europe%2FLondon"
            style={{ border: 0, width: "800px", height: "350px", frameborder: 0 }}
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Create;
