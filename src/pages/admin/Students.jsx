import { useMemo, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { DB, round1 } from '../../db.js';
import { useToast } from '../../Toast.jsx';

export default function AdminStudents() {
  const toast = useToast();
  const [students, setStudents] = useState(() => DB.get('students', []));
  const [results] = useState(() => DB.get('results', []));
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', dept: 'Computer Science', year: '1st Year' });

  const list = useMemo(() => {
    if (!search) return students;
    const f = search.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(f) || s.dept.toLowerCase().includes(f));
  }, [students, search]);

  function addStudent() {
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) { toast('Please fill all fields', 'error'); return; }
    const id = 'S' + String(students.length + 1).padStart(3, '0');
    const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    const next = [...students, { id, name, email, dept: form.dept, year: form.year, gpa: '—', avatar: initials, phone: '', enrolled: new Date().toISOString().split('T')[0] }];
    setStudents(next);
    DB.set('students', next);
    setForm({ name: '', email: '', dept: 'Computer Science', year: '1st Year' });
    toast('Student added successfully');
  }

  function viewStudent(id) {
    const s = students.find((x) => x.id === id);
    if (!s) return;
    const sResults = results.filter((r) => r.studentId === id);
    const avg = sResults.length ? round1(sResults.reduce((a, r) => a + r.percentage, 0) / sResults.length) + '%' : '—';
    alert(`Student: ${s.name}\nID: ${s.id}\nDept: ${s.dept}\nYear: ${s.year}\nExams taken: ${sResults.length}\nAvg score: ${avg}`);
  }

  function deleteStudent(id) {
    if (!confirm('Delete this student?')) return;
    const next = students.filter((s) => s.id !== id);
    setStudents(next);
    DB.set('students', next);
    toast('Student deleted', 'error');
  }

  return (
    <AdminLayout
      title="Students"
      topbarRight={
        <div className="search-box" style={{ width: 220 }}>
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      }
    >
      <div className="page-header">
        <h1>Students</h1>
        <p>Manage all registered students in the portal.</p>
      </div>

      <div className="panel mb-24">
        <h2 className="mb-16">Add New Student</h2>
        <div className="grid-2 gap-16">
          <div className="form-group"><label>Full Name</label><input type="text" placeholder="e.g. Priya Nair" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label>Email Address</label><input type="email" placeholder="student@college.edu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group">
            <label>Department</label>
            <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>
              <option>Computer Science</option><option>Electronics</option>
              <option>Mechanical</option><option>Civil</option><option>Information Technology</option>
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
              <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={addStudent}>+ Add Student</button>
      </div>

      <div className="panel">
        <div className="flex justify-between items-center mb-16">
          <h2>All Students</h2>
          <button className="btn btn-outline btn-sm" onClick={() => setStudents(DB.get('students', []))}>↻ Refresh</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>ID</th><th>Email</th><th>Department</th><th>Year</th><th>Exams</th><th>Avg Score</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {list.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No students found</td></tr>}
              {list.map((s) => {
                const sResults = results.filter((r) => r.studentId === s.id);
                const avg = sResults.length ? round1(sResults.reduce((a, r) => a + r.percentage, 0) / sResults.length) : 0;
                return (
                  <tr key={s.id}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{s.avatar}</div>{s.name}</div></td>
                    <td>{s.id}</td>
                    <td>{s.email}</td>
                    <td>{s.dept}</td>
                    <td>{s.year}</td>
                    <td>{sResults.length}</td>
                    <td>{avg ? avg + '%' : '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => viewStudent(s.id)}>View</button>{' '}
                      <button className="btn btn-sm btn-danger" onClick={() => deleteStudent(s.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
