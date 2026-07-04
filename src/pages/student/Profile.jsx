import { useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout.jsx';
import { DB, getCurrentStudentId, round1 } from '../../db.js';
import { useToast } from '../../Toast.jsx';

export default function StudentProfile() {
  const toast = useToast();
  const studentId = getCurrentStudentId();
  const students = DB.get('students', []);
  const s0 = students.find((x) => x.id === studentId) || {};
  const results = DB.get('results', []).filter((r) => r.studentId === studentId);
  const avg = results.length ? round1(results.reduce((a, r) => a + r.percentage, 0) / results.length) : 0;

  const [form, setForm] = useState({ name: s0.name || '', phone: s0.phone || '' });

  function saveProfile() {
    const next = students.map((s) => (s.id === studentId ? { ...s, name: form.name, phone: form.phone } : s));
    DB.set('students', next);
    toast('Profile saved successfully');
  }

  return (
    <StudentLayout title="My Profile">
      <div className="page-header"><h1>My Profile</h1><p>View and update your personal information.</p></div>

      <div className="grid-2 gap-20">
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 32 }}>
          <div className="avatar avatar-lg mb-12">{s0.avatar || 'S'}</div>
          <h2>{form.name || s0.name}</h2>
          <div className="text-muted text-sm mt-4">{s0.id || '—'}</div>
          <hr className="divider w-full" />
          <div className="grid-2 w-full gap-12 mt-4">
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{results.length}</div>
              <div className="text-muted text-sm">Exams taken</div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{avg}%</div>
              <div className="text-muted text-sm">Avg score</div>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2 className="mb-16">Edit Information</h2>
          <div className="form-group"><label>Full Name</label><input type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label>Email</label><input type="email" readOnly style={{ background: '#f9fafb', color: '#6b7280' }} value={s0.email || ''} /></div>
          <div className="form-group"><label>Department</label><input type="text" readOnly style={{ background: '#f9fafb', color: '#6b7280' }} value={s0.dept || ''} /></div>
          <div className="form-group"><label>Year</label><input type="text" readOnly style={{ background: '#f9fafb', color: '#6b7280' }} value={s0.year || ''} /></div>
          <div className="form-group"><label>Phone</label><input type="text" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <button className="btn btn-primary" onClick={saveProfile}>Save Changes</button>
        </div>
      </div>
    </StudentLayout>
  );
}
