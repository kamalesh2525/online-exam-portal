import { Link } from 'react-router-dom';
import AdminLayout, { PortalHomeLink } from '../../layouts/AdminLayout.jsx';
import { DB, formatDate, round1, statusBadgeClass } from '../../db.js';

export default function AdminDashboard() {
  const students = DB.get('students', []);
  const exams = DB.get('exams', []);
  const results = DB.get('results', []);

  const passCount = results.filter((r) => r.status === 'Pass').length;
  const passRate = results.length ? round1((passCount / results.length) * 100) : 0;
  const avgScore = results.length ? round1(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;
  const recent = results.slice(-5).reverse();
  const upcoming = exams.filter((e) => e.status !== 'Completed').slice(0, 4);

  return (
    <AdminLayout title="Dashboard" topbarRight={<PortalHomeLink />}>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here's an overview of your portal.</p>
      </div>

      <div className="grid-4 mb-24">
        <div className="card stat-card">
          <div className="icon-wrap icon-blue">👥</div>
          <div className="label">Total Students</div>
          <div className="value">{students.length}</div>
          <div className="sub">Registered</div>
        </div>
        <div className="card stat-card">
          <div className="icon-wrap icon-purple">📋</div>
          <div className="label">Total Exams</div>
          <div className="value">{exams.length}</div>
          <div className="sub">Created</div>
        </div>
        <div className="card stat-card">
          <div className="icon-wrap icon-green">✅</div>
          <div className="label">Pass Rate</div>
          <div className="value">{passRate}%</div>
          <div className="sub">Overall</div>
        </div>
        <div className="card stat-card">
          <div className="icon-wrap icon-orange">📊</div>
          <div className="label">Avg Score</div>
          <div className="value">{avgScore}%</div>
          <div className="sub">All exams</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="flex justify-between items-center mb-16">
            <h2>Recent Results</h2>
            <Link to="/admin/results" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Exam</th><th>Score</th><th>%</th><th>Status</th></tr></thead>
              <tbody>
                {recent.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af' }}>No results yet</td></tr>
                )}
                {recent.map((r) => {
                  const s = students.find((x) => x.id === r.studentId) || { name: 'Unknown' };
                  const e = exams.find((x) => x.id === r.examId) || { title: 'Unknown' };
                  return (
                    <tr key={r.id}>
                      <td>{s.name}</td>
                      <td>{e.title}</td>
                      <td>{r.score}/{r.total}</td>
                      <td>{round1(r.percentage)}%</td>
                      <td><span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="flex justify-between items-center mb-16">
            <h2>Upcoming Exams</h2>
            <Link to="/admin/exams" className="btn btn-outline btn-sm">Manage</Link>
          </div>
          <div>
            {upcoming.map((e) => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{e.subject} • {formatDate(e.date)}</div>
                </div>
                <span className={`badge ${statusBadgeClass(e.status)}`}>{e.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel mt-24">
        <h2 className="mb-16">Quick Actions</h2>
        <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
          <Link to="/admin/students" className="btn btn-primary">+ Add Student</Link>
          <Link to="/admin/exams" className="btn btn-primary">+ Create Exam</Link>
          <Link to="/admin/questionbank" className="btn btn-outline">+ Add Question</Link>
          <Link to="/admin/results" className="btn btn-outline">View All Results</Link>
          <Link to="/admin/reports" className="btn btn-outline">Download Reports</Link>
        </div>
      </div>
    </AdminLayout>
  );
}
