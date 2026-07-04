import { useMemo, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { DB, formatDate, statusBadgeClass } from '../../db.js';
import { useToast } from '../../Toast.jsx';

const emptyForm = { title: '', subject: '', duration: '', totalMarks: '', passMark: '', date: '', time: '' };

export default function AdminExams() {
  const toast = useToast();
  const [exams, setExams] = useState(() => DB.get('exams', []));
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);

  const list = useMemo(() => {
    if (!search) return exams;
    const f = search.toLowerCase();
    return exams.filter((e) => e.title.toLowerCase().includes(f) || e.subject.toLowerCase().includes(f));
  }, [exams, search]);

  function createExam() {
    const title = form.title.trim();
    const subject = form.subject.trim();
    const duration = parseInt(form.duration) || 60;
    const totalMarks = parseInt(form.totalMarks) || 30;
    const passMark = form.passMark || Math.round(totalMarks * 0.6);
    if (!title || !subject) { toast('Please fill title and subject', 'error'); return; }
    const id = 'E' + String(exams.length + 1).padStart(3, '0');
    const next = [...exams, { id, title, subject, duration, totalMarks: +totalMarks, passMark: +passMark, date: form.date, time: form.time, status: 'Upcoming', questions: [], created: new Date().toISOString().split('T')[0] }];
    setExams(next);
    DB.set('exams', next);
    setForm(emptyForm);
    toast('Exam created successfully');
  }

  function deleteExam(id) {
    if (!confirm('Delete this exam?')) return;
    const next = exams.filter((e) => e.id !== id);
    setExams(next);
    DB.set('exams', next);
    toast('Exam deleted', 'error');
  }

  function editExam() {
    toast('Edit mode — update form and save', 'info');
  }

  return (
    <AdminLayout
      title="Exams"
      topbarRight={
        <div className="search-box" style={{ width: 220 }}>
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search exams..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      }
    >
      <div className="page-header"><h1>Exam Management</h1><p>Create and manage exams for your students.</p></div>

      <div className="panel mb-24">
        <h2 className="mb-16">Create New Exam</h2>
        <div className="grid-3 gap-16">
          <div className="form-group"><label>Exam Title</label><input type="text" placeholder="e.g. DBMS Final Exam" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-group"><label>Subject</label><input type="text" placeholder="e.g. Database Management" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
          <div className="form-group"><label>Duration (minutes)</label><input type="number" placeholder="60" min="5" max="300" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
          <div className="form-group"><label>Total Marks</label><input type="number" placeholder="100" min="1" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} /></div>
          <div className="form-group"><label>Pass Mark</label><input type="number" placeholder="60" min="1" value={form.passMark} onChange={(e) => setForm({ ...form, passMark: e.target.value })} /></div>
          <div className="form-group"><label>Exam Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="form-group"><label>Exam Time</label><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary mt-8" onClick={createExam}>+ Create Exam</button>
      </div>

      <div className="panel">
        <div className="flex justify-between items-center mb-16">
          <h2>All Exams</h2>
          <button className="btn btn-outline btn-sm" onClick={() => setExams(DB.get('exams', []))}>↻ Refresh</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title / Subject</th><th>Date & Time</th><th>Duration</th><th>Total Marks</th><th>Questions</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {list.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No exams found</td></tr>}
              {list.map((e) => (
                <tr key={e.id}>
                  <td><div style={{ fontWeight: 600 }}>{e.title}</div><div style={{ fontSize: 12, color: '#6b7280' }}>{e.subject}</div></td>
                  <td>{formatDate(e.date)} {e.time}</td>
                  <td>{e.duration} min</td>
                  <td>{e.totalMarks}</td>
                  <td>{e.questions ? e.questions.length : 0}</td>
                  <td><span className={`badge ${statusBadgeClass(e.status)}`}>{e.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={editExam}>Edit</button>{' '}
                    <button className="btn btn-sm btn-danger" onClick={() => deleteExam(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
