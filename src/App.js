import { useEffect, useState } from "react";
import "./App.css";
const data = [
  {
    _id: 1,
    title: "My Notes 1",
    text: "This is Notes 1",
    disabled: true,
  },
  {
    _id: 2,
    title: "My Notes 2",
    text: "This is Notes 2",
    disabled: true,
  },
  {
    _id: 3,
    title: "My Notes 3",
    text: "This is Notes 3",
    disabled: true,
  },
];

function App() {
  const [Notes, setNotes] = useState([]);
  const [addTitle, setAddTitle] = useState("");
  const [addText, setAddText] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/notes")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setNotes(data.map((x) => ({ ...x, disabled: true })));
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleAdd = () => {
    const Note = {
      title: addTitle,
      text: addText,
    };

    fetch("http://localhost:8080/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Note),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        Notes.push({ ...data, disabled: true });
        setNotes([...Notes]);
      })
      .catch((err) => {
        console.log(err.message);
      });
    setAddTitle("");
    setAddText("");
  };

  const handleDelete = (_id) => {
    fetch(`http://localhost:8080/api/notes/${_id}`, {
      method: "DELETE",
    })
      .then(() => {
        const newNotes = Notes.filter((Note) => Note._id !== _id);
        setNotes(newNotes);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleEdit = (Note) => {
    if (!Note.disabled) {
      const newNote = {
        title: Note.title,
        text: Note.text,
      };
      fetch(`http://localhost:8080/api/notes/${Note._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          Note.disabled = !Note.disabled;
          setNotes([...Notes]);
        })
        .catch((err) => {
          console.log(err.message);
          alert("Unable to save note");
        });
    } else {
      Note.disabled = !Note.disabled;
      setNotes([...Notes]);
    }
  };

  const handleTitleChange = (e, Note) => {
    Note.title = e.target.value;
    setNotes([...Notes]);
  };

  const handleTextChange = (e, Note) => {
    Note.text = e.target.value;
    setNotes([...Notes]);
  };

  return (
    <div className="App">
      <div>
        <h1>Note Making</h1>
        <textarea
          value={addTitle}
          onChange={(e) => setAddTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={addText}
          onChange={(e) => setAddText(e.target.value)}
          placeholder="Description"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      {Notes.map((Note) => (
        <div className="Note-List" key={Note._id}>
          <input
            style={{
              width: "100%",
              height: "30px",
              fontSize: "30px",
              padding: "4px",
            }}
            value={Note.title}
            onChange={(e) => handleTitleChange(e, Note)}
            disabled={Note.disabled}
          />
          <input
            style={{
              width: "100%",
              height: "17px",
              fontSize: "17px",
              padding: "4px",
            }}
            value={Note.text}
            onChange={(e) => handleTextChange(e, Note)}
            disabled={Note.disabled}
          />
          <div>
            <button onClick={() => handleEdit(Note)}>
              {Note.disabled ? "Edit" : "Save"}
            </button>
            <button onClick={() => handleDelete(Note._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
