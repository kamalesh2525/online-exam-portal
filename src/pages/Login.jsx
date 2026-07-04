import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DB, setCurrentStudentId } from '../db.js';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | register
  const [tab, setTab] = useState('student'); // student | admin

  const [sEmail, setSEmail] = useState('kamalesh@student.com');
  const [sPwd, setSPwd] = useState('password123');
  const [aEmail, setAEmail] = useState('admin@exampro.com');
  const [aPwd, setAPwd] = useState('admin123');

  const [reg, setReg] = useState({ name: '', email: '', dept: '', year: '', phone: '', pwd: '', pwd2: '' });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  function loginStudent() {
    const students = DB.get('students', []);
    const match = students.find((s) => s.email.toLowerCase() === sEmail.trim().toLowerCase());
    setCurrentStudentId(match ? match.id : 'S001');
    navigate('/student/dashboard');
  }

  function loginAdmin() {
    navigate('/admin/dashboard');
  }

  function registerStudent() {
    const { name, email: rawEmail, dept, year, phone, pwd, pwd2 } = reg;
    const email = rawEmail.trim().toLowerCase();
    setRegSuccess('');

    if (!name.trim()) return setRegError('Full name is required.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setRegError('Enter a valid email address.');
    if (!dept) return setRegError('Please select your department.');
    if (!year) return setRegError('Please select your year.');
    if (pwd.length < 6) return setRegError('Password must be at least 6 characters.');
    if (pwd !== pwd2) return setRegError('Passwords do not match.');

    const students = DB.get('students', []);
    if (students.find((s) => s.email === email)) return setRegError('An account with this email already exists. Please sign in.');

    const maxNum = students.reduce((mx, s) => {
      const n = parseInt((s.id || '').replace('S', '') || 0);
      return n > mx ? n : mx;
    }, 0);
    const newId = 'S' + String(maxNum + 1).padStart(3, '0');
    const initials = name.trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

    const newStudent = {
      id: newId,
      name: name.trim(),
      email,
      dept,
      year,
      gpa: '—',
      avatar: initials,
      phone: phone.trim() || '',
      enrolled: new Date().toISOString().split('T')[0],
      pwd,
    };
    students.push(newStudent);
    DB.set('students', students);

    const creds = DB.get('credentials', []);
    creds.push({ email, pwd, studentId: newId });
    DB.set('credentials', creds);

    setRegError('');
    setReg({ name: '', email: '', dept: '', year: '', phone: '', pwd: '', pwd2: '' });
    setRegSuccess(`Account created! Welcome, ${name.trim()}. You can now sign in as a Student.`);

    setTimeout(() => {
      setMode('login');
      setTab('student');
      setSEmail(email);
      setSPwd('');
      setRegSuccess('');
    }, 1800);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="app-name">EXAM<span>PRO</span></div>
          <p>Online Examination Portal</p>
        </div>

        {mode === 'login' && (
          <div>
            <div className="login-tabs">
              <div className={`login-tab ${tab === 'student' ? 'active' : ''}`} onClick={() => setTab('student')}>Student</div>
              <div className={`login-tab ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>Admin</div>
            </div>

            {tab === 'student' && (
              <div>
                <div className="form-group">
                  <label>Student Email</label>
                  <input type="email" value={sEmail} onChange={(e) => setSEmail(e.target.value)} placeholder="student@college.edu" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={sPwd} onChange={(e) => setSPwd(e.target.value)} placeholder="••••••••" />
                </div>
                <button className="btn btn-primary btn-block btn-lg mt-8" onClick={loginStudent}>Sign In as Student</button>
              </div>
            )}

            {tab === 'admin' && (
              <div>
                <div className="form-group">
                  <label>Admin Email</label>
                  <input type="email" value={aEmail} onChange={(e) => setAEmail(e.target.value)} placeholder="admin@exampro.com" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" value={aPwd} onChange={(e) => setAPwd(e.target.value)} placeholder="••••••••" />
                </div>
                <button className="btn btn-primary btn-block btn-lg mt-8" onClick={loginAdmin}>Sign In as Admin</button>
              </div>
            )}

            <p className="login-switch-text">Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); }}>Create one</a></p>
          </div>
        )}

        {mode === 'register' && (
          <div>
            {regError && <div className="alert alert-danger mt-0 mb-16" style={{ fontSize: 13 }}>{regError}</div>}
            {regSuccess && <div className="alert alert-success mt-0 mb-16" style={{ fontSize: 13 }}>{regSuccess}</div>}

            <div className="form-group">
              <label>Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="text" value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} placeholder="e.g. Kamalesh R" />
            </div>
            <div className="form-group">
              <label>Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="email" value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} placeholder="yourname@college.edu" />
            </div>
            <div className="input-group">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Department <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select value={reg.dept} onChange={(e) => setReg({ ...reg, dept: e.target.value })}>
                  <option value="">Select…</option>
                  <option>Computer Science</option>
                  <option>Electronics</option>
                  <option>Mechanical</option>
                  <option>Civil</option>
                  <option>Chemical</option>
                  <option>Information Technology</option>
                  <option>Electrical</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Year <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select value={reg.year} onChange={(e) => setReg({ ...reg, year: e.target.value })}>
                  <option value="">Select…</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} placeholder="10-digit mobile number" maxLength={10} />
            </div>
            <div className="form-group">
              <label>Password <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="password" value={reg.pwd} onChange={(e) => setReg({ ...reg, pwd: e.target.value })} placeholder="Minimum 6 characters" />
            </div>
            <div className="form-group">
              <label>Confirm Password <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="password" value={reg.pwd2} onChange={(e) => setReg({ ...reg, pwd2: e.target.value })} placeholder="Re-enter your password" />
            </div>

            <button className="btn btn-primary btn-block btn-lg mt-4" onClick={registerStudent}>Create Account</button>
            <p className="login-switch-text">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>Sign in</a></p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#9ca3af' }}>
          EXAMPRO v2.0 &nbsp;•&nbsp; Fully offline, no backend required
        </div>
      </div>
    </div>
  );
}
