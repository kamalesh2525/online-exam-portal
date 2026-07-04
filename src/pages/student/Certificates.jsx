import StudentLayout from '../../layouts/StudentLayout.jsx';
import { DB, formatDate, getCurrentStudentId, round1 } from '../../db.js';
import { useToast } from '../../Toast.jsx';

export default function StudentCertificates() {
  const toast = useToast();
  const studentId = getCurrentStudentId();
  const results = DB.get('results', []).filter((r) => r.studentId === studentId && r.status === 'Pass');
  const exams = DB.get('exams', []);
  const students = DB.get('students', []);
  const student = students.find((s) => s.id === studentId) || { name: 'Student' };

  function downloadCert(examTitle, name, score, date) {
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Certificate</title>
      <style>body{font-family:Georgia,serif;text-align:center;padding:60px;border:8px solid #2563eb;margin:20px}
      h1{font-size:36px;color:#1e3a5f}h2{font-size:22px;color:#2563eb}p{font-size:16px;color:#374151}</style></head>
      <body><h1>🏆 Certificate of Achievement</h1><p>This is to certify that</p><h2>${name}</h2>
      <p>has successfully completed</p><h2>${examTitle}</h2>
      <p>with a score of <strong>${score}%</strong> on ${date}</p>
      <p style="margin-top:40px;color:#9ca3af">EXAMPRO Online Examination Portal</p>
      <script>window.print()</script></body></html>`);
  }

  return (
    <StudentLayout title="Certificates">
      <div className="page-header"><h1>My Certificates</h1><p>Download certificates for exams you have passed.</p></div>

      {results.length === 0 && (
        <div className="empty"><div className="icon">🏅</div><h3>No certificates yet</h3><p>Pass an exam to earn a certificate.</p></div>
      )}

      <div className="grid-2">
        {results.map((r) => {
          const e = exams.find((x) => x.id === r.examId) || { title: 'Unknown', subject: '—' };
          return (
            <div className="cert-card card mb-16" key={r.id}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
              <div className="cert-title">Certificate of Achievement</div>
              <div className="cert-sub">This is to certify that</div>
              <div className="cert-name">{student.name}</div>
              <div className="cert-details">has successfully completed</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1f2937', margin: '8px 0' }}>{e.title}</div>
              <div className="cert-details">{e.subject} • Score: {round1(r.percentage)}% • {formatDate(r.date)}</div>
              <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn-primary btn-sm" onClick={() => downloadCert(e.title, student.name, round1(r.percentage), formatDate(r.date))}>Download PDF</button>
                <button className="btn btn-outline btn-sm" onClick={() => toast('Certificate shared!', 'info')}>Share</button>
              </div>
            </div>
          );
        })}
      </div>
    </StudentLayout>
  );
}
