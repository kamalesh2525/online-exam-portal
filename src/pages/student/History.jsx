import StudentLayout from '../../layouts/StudentLayout.jsx';
import { DB, formatDate, getCurrentStudentId, round1, statusBadgeClass } from '../../db.js';

export default function StudentHistory() {
  const studentId = getCurrentStudentId();
  const results = [...DB.get('results', []).filter((r) => r.studentId === studentId)].reverse();
  const exams = DB.get('exams', []);

  return (
    <StudentLayout title="Exam History">
      <div className="page-header"><h1>Exam History</h1><p>All your past exam attempts in chronological order.</p></div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Exam</th><th>Date</th><th>Score</th><th>Percentage</th><th>Time Taken</th><th>Status</th></tr></thead>
            <tbody>
              {results.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>No history yet</td></tr>}
              {results.map((r) => {
                const e = exams.find((x) => x.id === r.examId) || { title: 'Unknown', subject: '—' };
                return (
                  <tr key={r.id}>
                    <td><div style={{ fontWeight: 600 }}>{e.title}</div><div className="text-sm text-muted">{e.subject}</div></td>
                    <td>{formatDate(r.date)}</td>
                    <td>{r.score}/{r.total}</td>
                    <td><strong>{round1(r.percentage)}%</strong></td>
                    <td>{r.timeTaken} min</td>
                    <td><span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </StudentLayout>
  );
}
