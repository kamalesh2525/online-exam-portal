import { Link, NavLink } from 'react-router-dom';
import { DB, getCurrentStudentId } from '../db.js';

const nav = [
  { section: 'Overview', links: [
    { to: '/student/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/student/profile', icon: '👤', label: 'Profile' },
  ]},
  { section: 'Exams', links: [
    { to: '/student/exams', icon: '📋', label: 'My Exams' },
    { to: '/student/takeexam', icon: '✏️', label: 'Take Exam' },
  ]},
  { section: 'Performance', links: [
    { to: '/student/results', icon: '📊', label: 'Results' },
    { to: '/student/history', icon: '📅', label: 'History' },
    { to: '/student/certificates', icon: '🏆', label: 'Certificates' },
  ]},
  { section: 'Other', links: [
    { to: '/student/notifications', icon: '🔔', label: 'Notifications' },
  ]},
];

export default function StudentLayout({ title, topbarRight, children }) {
  const students = DB.get('students', []);
  const me = students.find((s) => s.id === getCurrentStudentId()) || { name: 'Student', email: '', avatar: 'S' };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo">EXAM<span>PRO</span></div>
          <div className="role-badge">Student Portal</div>
        </div>
        <nav>
          {nav.map((sec) => (
            <div className="nav-section" key={sec.section}>
              <div className="nav-label">{sec.section}</div>
              {sec.links.map((l) => (
                <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                  <span className="icon">{l.icon}</span> {l.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{me.avatar}</div>
            <div className="user-info">
              <div className="name">{me.name}</div>
              <div className="email">{me.email}</div>
            </div>
            <Link to="/">Logout</Link>
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">{title}</div>
          </div>
          <div className="topbar-right">
            {topbarRight}
          </div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
