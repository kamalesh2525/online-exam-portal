import { useMemo, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { DB, formatDate, round1, statusBadgeClass } from '../../db.js';

export default function AdminResults() {
  const [results] = useState(() => DB.get('results', []));
  const [students] = useState(() => DB.get('students', []));
  const [exams] = useState(() => DB.get('exams', []));
  const [search, setSearch] = useState('');

  const list = useMemo(() => {
    if (!search) return results;
    const f = search.toLowerCase();
    return results.filter((r) => {
      const s = students.find((x) => x.id === r.studentId) || { name: '' };
      const e = exams.find((x) => x.id === r.examId) || { title: '' };
      return s.name.toLowerCase().includes(f) || e.title.toLowerCase().includes(f);
    });
  }, [results, students, exams, search]);

  const pass = results.filter((r) => r.status === 'Pass').length;
  const avgPct = results.length ? round1(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;

  return (
    <AdminLayout
      title="Results"
      topbarRight={
        <div className="search-box" style={{ width: 220 }}>
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search results..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      }
    >
      <div className="page-header"><h1>Exam Results</h1><p>View and analyze all student exam results.</p></div>

      <div className="grid-4 mb-24">
        <div className="card stat-card"><div className="icon-wrap icon-blue">📋</div><div className="label">Total Submissions</div><div className="value">{results.length}</div></div>
        <div className="card stat-card"><div className="icon-wrap icon-green">✅</div><div className="label">Passed</div><div className="value">{pass}</div></div>
        <div className="card stat-card"><div className="icon-wrap icon-red">❌</div><div className="label">Failed</div><div className="value">{results.length - pass}</div></div>
        <div className="card stat-card"><div className="icon-wrap icon-orange">📊</div><div className="label">Average Score</div><div className="value">{avgPct}%</div></div>
      </div>

      <div className="panel">
        <div className="flex justify-between items-center mb-16">
          <h2>All Results</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Exam</th><th>Score</th><th>Percentage</th><th>Time Taken</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {list.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No results found</td></tr>}
              {list.map((r) => {
                const s = students.find((x) => x.id === r.studentId) || { name: 'Unknown', avatar: '?' };
                const e = exams.find((x) => x.id === r.examId) || { title: 'Unknown' };
                return (
                  <tr key={r.id}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{s.avatar}</div>{s.name}</div></td>
                    <td>{e.title}</td>
                    <td>{r.score}/{r.total}</td>
                    <td><strong>{round1(r.percentage)}%</strong></td>
                    <td>{r.timeTaken} min</td>
                    <td>{formatDate(r.date)}</td>
                    <td><span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span></td>
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
