import { useMemo, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { DB, diffBadgeClass } from '../../db.js';
import { useToast } from '../../Toast.jsx';

const emptyForm = { text: '', subject: 'Database Management', diff: 'Easy', marks: 2, opt1: '', opt2: '', opt3: '', opt4: '', correct: 0 };

export default function AdminQuestionBank() {
  const toast = useToast();
  const [questions, setQuestions] = useState(() => DB.get('questions', []));
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);

  const list = useMemo(() => {
    if (!search) return questions;
    const f = search.toLowerCase();
    return questions.filter((q) => q.text.toLowerCase().includes(f) || q.subject.toLowerCase().includes(f));
  }, [questions, search]);

  function addQuestion() {
    const text = form.text.trim();
    const opts = [form.opt1, form.opt2, form.opt3, form.opt4].map((o) => o.trim());
    if (!text || opts.some((o) => !o)) { toast('Fill question and all 4 options', 'error'); return; }
    const id = 'Q' + String(questions.length + 1).padStart(3, '0');
    const next = [...questions, { id, text, subject: form.subject, difficulty: form.diff, marks: parseInt(form.marks) || 2, options: opts, correct: parseInt(form.correct) || 0 }];
    setQuestions(next);
    DB.set('questions', next);
    setForm(emptyForm);
    toast('Question added');
  }

  function deleteQuestion(id) {
    if (!confirm('Delete this question?')) return;
    const next = questions.filter((q) => q.id !== id);
    setQuestions(next);
    DB.set('questions', next);
    toast('Question deleted', 'error');
  }

  return (
    <AdminLayout
      title="Question Bank"
      topbarRight={
        <div className="search-box" style={{ width: 220 }}>
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search questions..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      }
    >
      <div className="page-header"><h1>Question Bank</h1><p>Add and manage your exam question pool.</p></div>

      <div className="panel mb-24">
        <h2 className="mb-16">Add New Question</h2>
        <div className="form-group"><label>Question Text</label><textarea rows={3} placeholder="Enter the question here..." value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></div>
        <div className="grid-3 gap-16">
          <div className="form-group">
            <label>Subject</label>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
              <option>Database Management</option><option>Data Structures</option>
              <option>Operating Systems</option><option>Computer Networks</option>
              <option>Software Engineering</option><option>Programming</option>
            </select>
          </div>
          <div className="form-group">
            <label>Difficulty</label>
            <select value={form.diff} onChange={(e) => setForm({ ...form, diff: e.target.value })}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </div>
          <div className="form-group"><label>Marks</label><input type="number" min="1" max="10" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} /></div>
        </div>
        <div className="grid-2 gap-16 mb-16">
          <div className="form-group"><label>Option A</label><input type="text" placeholder="Option A" value={form.opt1} onChange={(e) => setForm({ ...form, opt1: e.target.value })} /></div>
          <div className="form-group"><label>Option B</label><input type="text" placeholder="Option B" value={form.opt2} onChange={(e) => setForm({ ...form, opt2: e.target.value })} /></div>
          <div className="form-group"><label>Option C</label><input type="text" placeholder="Option C" value={form.opt3} onChange={(e) => setForm({ ...form, opt3: e.target.value })} /></div>
          <div className="form-group"><label>Option D</label><input type="text" placeholder="Option D" value={form.opt4} onChange={(e) => setForm({ ...form, opt4: e.target.value })} /></div>
        </div>
        <div className="form-group" style={{ maxWidth: 200 }}>
          <label>Correct Answer</label>
          <select value={form.correct} onChange={(e) => setForm({ ...form, correct: e.target.value })}>
            <option value={0}>Option A</option><option value={1}>Option B</option><option value={2}>Option C</option><option value={3}>Option D</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={addQuestion}>+ Add Question</button>
      </div>

      <div className="panel">
        <div className="flex justify-between items-center mb-16">
          <h2>All Questions</h2>
          <button className="btn btn-outline btn-sm" onClick={() => setQuestions(DB.get('questions', []))}>↻ Refresh</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Question</th><th>Subject</th><th>Difficulty</th><th>Marks</th><th>Correct Answer</th><th>Actions</th></tr></thead>
            <tbody>
              {list.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No questions found</td></tr>}
              {list.map((q) => (
                <tr key={q.id}>
                  <td style={{ maxWidth: 300, fontSize: 13 }}>{q.text}</td>
                  <td>{q.subject}</td>
                  <td><span className={`badge ${diffBadgeClass(q.difficulty)}`}>{q.difficulty}</span></td>
                  <td>{q.marks}</td>
                  <td>{q.options[q.correct]}</td>
                  <td><button className="btn btn-sm btn-danger" onClick={() => deleteQuestion(q.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
