import React from "react";
import "./../../src/styles/ClassCard.css";

const ClassCard = () => {
  return (
    <div className="center-container">
      <div className="class-card-container">
        <div className="date">
          <p id="fontLarge">18</p>
          <p id="fontMedium">November</p>
          <p id="fontMedium">2023</p>
          <p id="fontSmall">10.00 - 17.00</p>
        </div>

        <div className="module">
          <h1>LC/module</h1>
          <p>LC/lesson_topic</p>
        </div>

        <div className="butons">
          <button>Agenda</button>
          <button>LC/syllabus_link</button>
          <button>S/location</button>
        </div>

        <div className="week">LC/week_no</div>
      </div>
    </div>
  );
};

export default ClassCard;
