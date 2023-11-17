import React, { useState } from "react";
import Modal from "react-modal";
import "./../../src/styles/ClassCard.css";

const ClassCard = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleShowModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const agendaColumns = ["Topic", "Section", "Leader", "Description"];
  const agendaRows = [
    ["10:00 - 10:20", "Energiser", "Trainees", "Description A"],
    ["10:20 - 10:30", "Schedule Overview", "", ""],
    ["10:30 - 11:25", "Project", "Groups", ""],
    ["11:25 - 11:35", "Break"],
    ["11:35 - 12:00", "Project", "Groups", ""],
    ["12:00 - 12:15", "Break"],
    ["12:15 - 13:00", "Project", "Groups", ""],
    ["13:00 - 14:00", "Break"],
    ["14:00 - 15:00", "Project", "Groups", ""],
    ["15:00 - 15:15", "Break"],
    ["15:15 - 16:00", "Project", "Groups", ""],
    ["16:00 - 16:15", "Break"],
    ["16:15 - 16:45", "PD", "Volunteer", ""],
    ["16:45 - 17:00", "Feedback", "Volunteer", "Feedback Link"],
  ];

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
          <div className="module-info">
            <h1 id="fontFam">JavaScript Core 1</h1>
            <p>LC/lesson_topic</p>
          </div>
          <div className="module-button">
            <button>
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios-filled/50/literature--v1.png"
                alt="literature--v1"
              />
              Syllabus
            </button>
            <button onClick={handleShowModal}>
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios-filled/50/task-planning.png"
                alt="task-planning"
              />
              Agenda
            </button>
          </div>
          <div className="registration">
            <button className="registration-button">Register for Class</button>
          </div>
        </div>

        <div className="butons">
          <button>
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/android/24/place-marker.png"
              alt="place-marker"
            />
            S/location
          </button>
        </div>

        <div className="week">
          <p id="fontMedium">Week</p>
          <p id="fontLarge">17</p>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <table>
            <thead>
              <tr>
                {agendaColumns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agendaRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td className="break" key={cellIndex} colSpan={cell === "Break" ? 3 : 1}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleCloseModal}>Close Agenda</button>
        </Modal>
      </div>
    </div>
  );
};

export default ClassCard;
