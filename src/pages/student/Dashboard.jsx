import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout.jsx';
import { DB, formatDate, getCurrentStudentId, round1, statusBadgeClass } from '../../db.js';

export default function StudentDashboard() {
  const studentId = getCurrentStudentId();
  const students = DB.get('students', []);
  const me = students.find((s) => s.id === studentId) || { name: 'Student' };
  const results = DB.get('results', []).filter((r) => r.studentId === studentId);
  const exams = DB.get('exams', []);
  const upcoming = exams.filter((e) => e.status !== 'Completed');
  const avg = results.length ? round1(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;
  const best = results.length ? round1(Math.max(...results.map((r) => r.percentage))) : 0;
  const recent = results.slice(-4).reverse();
  const firstName = me.name.split(' ')[0];

  return (
    <StudentLayout
      title="Dashboard"
      topbarRight={
        <>
          <Link to="/student/notifications" className="btn btn-outline btn-sm">🔔 Notifications</Link>
          <Link to="/student/profile" className="btn btn-outline btn-sm">👤 Profile</Link>
        </>
      }
    >
      <div className="page-header">
        <h1>Welcome back, {firstName}! 👋</h1>
        <p>Here's your academic overview.</p>
      </div>

      <div className="grid-4 mb-24">
        <div className="card stat-card"><div className="icon-wrap icon-orange">📋</div><div className="label">Upcoming Exams</div><div className="value">{upcoming.length}</div></div>
        <div className="card stat-card"><div className="icon-wrap icon-blue">✅</div><div className="label">Completed</div><div className="value">{results.length}</div></div>
        <div className="card stat-card"><div className="icon-wrap icon-green">📊</div><div className="label">Average Score</div><div className="value">{avg}%</div></div>
        <div className="card stat-card"><div className="icon-wrap icon-purple">🏆</div><div className="label">Best Score</div><div className="value">{best}%</div></div>
      </div>

      <div className="grid-2">
        <div>
          <div className="flex justify-between items-center mb-16">
            <h2>Upcoming Exams</h2>
            <Link to="/student/exams" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div>
            {upcoming.slice(0, 3).map((e) => (
              <div className="exam-card card mb-12" key={e.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3>{e.title}</h3>
                    <div className="exam-meta mt-4"><span>📚 {e.subject}</span><span>⏱ {e.duration} min</span><span>📅 {formatDate(e.date)}</span></div>
                  </div>
                  <span className={`badge ${statusBadgeClass(e.status)}`}>{e.status}</span>
                </div>
                <div><Link to={`/student/takeexam?id=${e.id}`} className="btn btn-primary btn-sm mt-8">Start Exam</Link></div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="flex justify-between items-center mb-16">
            <h2>Recent Results</h2>
            <Link to="/student/results" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div>
            {recent.length === 0 && <div className="empty"><div>No results yet</div></div>}
            {recent.map((r) => {
              const e = exams.find((x) => x.id === r.examId) || { title: 'Unknown' };
              return (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{formatDate(r.date)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{round1(r.percentage)}%</div>
                    <span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
