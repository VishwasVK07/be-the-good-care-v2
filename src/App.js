import { useState, useEffect } from 'react';
import './App.css';

const TAG_OPTIONS = [
  'Compassion', 'Communication', 'Teamwork', 'Respect',
  'Reassurance', 'Problem-Solving', 'Positivity',
  'Professional Excellence', 'Above & Beyond'
];

const API_URL = 'http://127.0.0.1:5000';

function App() {
  const [activeTab, setActiveTab] = useState('note');

  // ---- form state (for the "Leave a Note" tab) ----
  const [staffName, setStaffName] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // ---- notes list state (for the "My Notes" tab) ----
  const [allNotes, setAllNotes] = useState([]);
  const [searchName, setSearchName] = useState('');

  function toggleTag(tag) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault(); // stops the page from doing a full reload on submit

    await fetch(`${API_URL}/recognitions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        staff_name: staffName,
        department: department,
        tags: selectedTags,
        note: note
      })
    });

    // reset the form
    setStaffName('');
    setDepartment('');
    setSelectedTags([]);
    setNote('');
    setSubmitted(true);
  }

  async function loadNotes() {
    const res = await fetch(`${API_URL}/recognitions`);
    const data = await res.json();
    setAllNotes(data);
  }

  // whenever the "My Notes" tab becomes active, fetch the latest notes
  useEffect(() => {
    if (activeTab === 'notes') {
      loadNotes();
    }
  }, [activeTab]);

  const filteredNotes = allNotes.filter((n) =>
    n.staff_name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="app">
      <header className="site-header">
        <p className="eyebrow">✦ Be The Good Care ✦</p>
        <h1>Small moments, kept.</h1>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'note' ? 'tab active' : 'tab'}
          onClick={() => { setActiveTab('note'); setSubmitted(false); }}
        >
          Leave a Note
        </button>
        <button
          className={activeTab === 'notes' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('notes')}
        >
          My Notes
        </button>
        <button
          className={activeTab === 'review' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('review')}
        >
          Review Queue
        </button>
      </nav>

      <main>
        {activeTab === 'note' && (
          submitted ? (
            <div className="confirmation">
              <h2>Note sent.</h2>
              <p>Thank you for taking the time to say something kind.</p>
              <button className="submit-btn" onClick={() => setSubmitted(false)}>
                Write another note
              </button>
            </div>
          ) : (
            <form className="note-form" onSubmit={handleSubmit}>
              <div className="form-intro">
                <h2>Leave a note.</h2>
                <p>A moment of good care, put into words.</p>
              </div>

              <div className="field">
                <label htmlFor="staffName">Who's this for?</label>
                <input
                  type="text"
                  id="staffName"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Priya N."
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Emergency"
                  required
                />
              </div>

              <div className="field">
                <span className="field-label">What stood out?</span>
                <div className="chip-group">
                  {TAG_OPTIONS.map((tag) => (
                    <label
                      key={tag}
                      className={selectedTags.includes(tag) ? 'chip chip-active' : 'chip'}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="note">Your note</label>
                <textarea
                  id="note"
                  rows="5"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tell us what happened..."
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Send this note</button>
            </form>
          )
        )}

        {activeTab === 'notes' && (
          <div className="notes-view">
            <h2>Notes</h2>
            <input
              type="text"
              placeholder="Search by staff name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />
            {filteredNotes.length === 0 && <p className="empty-msg">No notes found.</p>}
            {filteredNotes.map((n) => (
              <div key={n.id} className="note-card">
                <div className="note-card-header">
                  <strong>{n.staff_name}</strong> · {n.department}
                </div>
                <div className="chip-group">
                  {n.tags.map((t) => <span key={t} className="chip chip-static">{t}</span>)}
                </div>
                <p className="note-text">"{n.note}"</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'review' && (
          <div className="notes-view">
            <h2>Review Queue</h2>
            <p className="empty-msg">
              Not built yet — this needs a "status" field added to the backend
              so notes can be approved before showing up in My Notes. Good next
              project once you're comfortable with the Python side.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;