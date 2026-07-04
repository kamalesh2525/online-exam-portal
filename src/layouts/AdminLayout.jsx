import { Link, NavLink } from 'react-router-dom';

const nav = [
  { section: 'Main', links: [
    { to: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/admin/students', icon: '👥', label: 'Students' },
    { to: '/admin/exams', icon: '📋', label: 'Exams' },
    { to: '/admin/questionbank', icon: '❓', label: 'Question Bank' },
  ]},
  { section: 'Analytics', links: [
    { to: '/admin/results', icon: '📊', label: 'Results' },
    { to: '/admin/reports', icon: '📈', label: 'Reports' },
  ]},
  // { section: 'System', links: [
  //   { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
  // ]},
];

export default function AdminLayout({ title, topbarRight, children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo">EXAM<span>PRO</span></div>
          <div className="role-badge">Admin Panel</div>
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
            <div className="avatar">AD</div>
            <div className="user-info">
              <div className="name">Admin</div>
              <div className="email">admin@exampro.com</div>
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

export function PortalHomeLink() {
  return <Link to="/" className="btn btn-outline btn-sm">← Portal Home</Link>;
}
