import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Initialize subjects state from Local Storage
  const [subjects, setSubjects] = useState(() => {
    try {
      const storedSubjects = localStorage.getItem('subjects');
      return storedSubjects ? JSON.parse(storedSubjects) : [];
    } catch (error) {
      console.error('Failed to parse subjects from Local Storage:', error);
      return [];
    }
  });

  const [subjectInput, setSubjectInput] = useState('');
  const [hoursInput, setHoursInput] = useState(1);

  // Update Local Storage whenever subjects change
  useEffect(() => {
    try {
      localStorage.setItem('subjects', JSON.stringify(subjects));
      console.log('Subjects saved to Local Storage:', subjects);
    } catch (error) {
      console.error('Failed to save subjects to Local Storage:', error);
    }
  }, [subjects]);

  const handleAddSubject = () => {
    if (subjectInput.trim() === '' || hoursInput < 1) {
      alert('Please enter a valid subject and hours.');
      return;
    }

    // Check for duplicate subjects
    const isDuplicate = subjects.some(
      (subject) => subject.name.toLowerCase() === subjectInput.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert('This subject already exists.');
      return;
    }

    const newSubject = {
      id: Date.now(),
      name: subjectInput.trim(),
      hours: parseInt(hoursInput, 10),
    };

    setSubjects([...subjects, newSubject]);
    setSubjectInput('');
    setHoursInput(1);
  };

  const handleIncrease = (id) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id
          ? { ...subject, hours: subject.hours + 1 }
          : subject
      )
    );
  };

  const handleDecrease = (id) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id
          ? { ...subject, hours: subject.hours > 1 ? subject.hours - 1 : 1 }
          : subject
      )
    );
  };

  const handleDelete = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  return (
    <div className="container">
      <h1>Education Planner</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Subject"
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
        />
        <input
          type="number"
          min="1"
          placeholder="Hours"
          value={hoursInput}
          onChange={(e) => setHoursInput(e.target.value)}
        />
        <button onClick={handleAddSubject}>Add</button>
      </div>

      <div className="subjects-container">
        {subjects.length === 0 ? (
          <p>No subjects added yet.</p>
        ) : (
          subjects.map((subject) => (
            <div key={subject.id} className="subject-item">
              <span className="subject-name">{subject.name}</span>
              <div className="hours-controls">
                <button onClick={() => handleDecrease(subject.id)}>-</button>
                <span>{subject.hours}h</span>
                <button onClick={() => handleIncrease(subject.id)}>+</button>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(subject.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
