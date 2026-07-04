import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout.jsx';
import { DB, formatDate, getCurrentStudentId, round1, statusBadgeClass } from '../../db.js';

export default function StudentExams() {
  const studentId = getCurrentStudentId();
  const exams = DB.get('exams', []);
  const results = DB.get('results', []).filter((r) => r.studentId === studentId);
  const takenIds = new Set(results.map((r) => r.examId));

  const upcoming = exams.filter((e) => e.status !== 'Completed');
  const completed = exams.filter((e) => takenIds.has(e.id));

  return (
    <StudentLayout title="My Exams">
      <div className="page-header"><h1>My Exams</h1><p>Available and completed exams.</p></div>

      <h3 style={{ marginBottom: 14 }}>Available Exams</h3>
      {upcoming.map((e) => (
        <div className="exam-card card mb-12" key={e.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>{e.title}</h3>
              <div className="exam-meta mt-4">
                <span>📚 {e.subject}</span><span>⏱ {e.duration} min</span><span>📝 {e.totalMarks} marks</span><span>📅 {formatDate(e.date)} {e.time}</span>
              </div>
            </div>
            <span className={`badge ${statusBadgeClass(e.status)}`}>{e.status}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {takenIds.has(e.id)
              ? <span className="badge badge-green">Completed</span>
              : <Link to={`/student/takeexam?id=${e.id}`} className="btn btn-primary btn-sm">Take Exam →</Link>}
          </div>
        </div>
      ))}

      {completed.length > 0 && <h3 style={{ margin: '20px 0 14px' }}>Completed Exams</h3>}
      {completed.map((e) => {
        const r = results.find((x) => x.examId === e.id);
        return (
          <div className="exam-card card mb-12" key={e.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3>{e.title}</h3>
                <div className="exam-meta mt-4"><span>📚 {e.subject}</span><span>Score: {r.score}/{r.total} ({round1(r.percentage)}%)</span></div>
              </div>
              <span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span>
            </div>
            <Link to="/student/results" className="btn btn-outline btn-sm mt-8">View Result</Link>
          </div>
        );
      })}
    </StudentLayout>
  );
}
