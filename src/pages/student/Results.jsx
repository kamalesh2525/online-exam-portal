import StudentLayout from '../../layouts/StudentLayout.jsx';
import { DB, formatDate, getCurrentStudentId, round1, statusBadgeClass } from '../../db.js';

export default function StudentResults() {
  const studentId = getCurrentStudentId();
  const results = DB.get('results', []).filter((r) => r.studentId === studentId);
  const exams = DB.get('exams', []);
  const qs = DB.get('questions', []);

  return (
    <StudentLayout title="My Results">
      <div className="page-header"><h1>My Results</h1><p>Detailed breakdown of your exam performances.</p></div>

      {results.length === 0 && (
        <div className="empty"><div className="icon">📊</div><h3>No results yet</h3><p>Take an exam to see your results here.</p></div>
      )}

      {results.map((r) => {
        const e = exams.find((x) => x.id === r.examId) || { title: 'Unknown', questions: [] };
        const eQs = qs.filter((q) => e.questions && e.questions.includes(q.id));
        const correct = eQs.filter((q) => r.answers && r.answers[q.id] === q.correct).length;
        return (
          <div className="card mb-16" style={{ padding: 24 }} key={r.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3>{e.title}</h3>
                <div className="text-muted text-sm mt-4">{formatDate(r.date)} • {r.timeTaken} min</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: r.status === 'Pass' ? '#16a34a' : '#dc2626' }}>{round1(r.percentage)}%</div>
                <span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
              <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{r.score}</div>
                <div className="text-muted text-sm">Score</div>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{correct}</div>
                <div className="text-muted text-sm">Correct</div>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{eQs.length - correct}</div>
                <div className="text-muted text-sm">Wrong</div>
              </div>
            </div>
            <div className="progress-bar">
              <div className={`progress-fill ${r.status === 'Pass' ? 'progress-green' : 'progress-orange'}`} style={{ width: `${r.percentage}%` }} />
            </div>
          </div>
        );
      })}
    </StudentLayout>
  );
}
