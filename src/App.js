import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("All");
  const [editIndex, setEditIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const inputRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes"));
    const savedTheme = JSON.parse(localStorage.getItem("darkMode"));

    if (savedNotes) setNotes(savedNotes);
    if (savedTheme) setDarkMode(savedTheme);
  }, []);

  // Save notes
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Save theme
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Focus input
  useEffect(() => {
    inputRef.current.focus();
  }, [editIndex]);

  const addNote = () => {
    if (input.trim() === "" || category.trim() === "") return;

    const now = new Date().toLocaleString();

    if (editIndex !== null) {
      const updated = [...notes];
      updated[editIndex] = {
        ...updated[editIndex],
        text: input,
        category,
        updatedAt: now,
      };
      setNotes(updated);
      setEditIndex(null);
    } else {
      setNotes([
        ...notes,
        {
          text: input,
          category,
          createdAt: now,
          updatedAt: null,
        },
      ]);
    }

    setInput("");
    setCategory("");
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const editNote = (index) => {
    setInput(notes[index].text);
    setCategory(notes[index].category);
    setEditIndex(index);
  };

  const filteredNotes =
    filter === "All"
      ? notes
      : notes.filter((note) => note.category === filter);

  const categories = ["All", ...new Set(notes.map((n) => n.category))];

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className="header">
        <h1>📝 Notes</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="input-box">
        <input
          ref={inputRef}
          type="text"
          placeholder="Write a note..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category (e.g. School)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button onClick={addNote}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* Category Filter */}
      <div className="filters">
        {categories.map((cat, i) => (
          <button
            key={i}
            className={filter === cat ? "active" : ""}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="notes">
        {filteredNotes.length === 0 ? (
          <p className="empty">No notes found</p>
        ) : (
          filteredNotes.map((note, index) => (
            <div key={index} className="note">
              <p>{note.text}</p>
              <small>📂 {note.category}</small>
              <small>🕒 Created: {note.createdAt}</small>
              {note.updatedAt && (
                <small>✏️ Updated: {note.updatedAt}</small>
              )}

              <div className="actions">
                <button onClick={() => editNote(index)}>Edit</button>
                <button onClick={() => deleteNote(index)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;