import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { DB, round1, statusBadgeClass } from '../../db.js';
import { useToast } from '../../Toast.jsx';

export default function AdminReports() {
  const toast = useToast();
  const [results] = useState(() => DB.get('results', []));
  const [exams] = useState(() => DB.get('exams', []));
  const [students] = useState(() => DB.get('students', []));

  function exportCSV() {
    const rows = [['Student', 'Exam', 'Score', 'Percentage', 'Status', 'Date']];
    results.forEach((r) => {
      const s = students.find((x) => x.id === r.studentId) || { name: '?' };
      const e = exams.find((x) => x.id === r.examId) || { title: '?' };
      rows.push([s.name, e.title, r.score + '/' + r.total, round1(r.percentage) + '%', r.status, r.date]);
    });
    const csv = rows.map((r) => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'exampro_results.csv';
    a.click();
    toast('CSV downloaded');
  }

  return (
    <AdminLayout title="Reports" topbarRight={<button className="btn btn-primary btn-sm" onClick={() => window.print()}>🖨️ Print Report</button>}>
      <div className="page-header"><h1>Reports &amp; Analytics</h1><p>Exam-wise performance breakdown and statistics.</p></div>

      <div className="panel mb-24">
        <h2 className="mb-16">Exam Performance Breakdown</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Exam Title</th><th>Submissions</th><th>Pass / Total</th><th>Avg Score</th><th>Highest Score</th><th>Status</th></tr></thead>
            <tbody>
              {exams.map((e) => {
                const eResults = results.filter((r) => r.examId === e.id);
                const pass = eResults.filter((r) => r.status === 'Pass').length;
                const avg = eResults.length ? round1(eResults.reduce((s, r) => s + r.percentage, 0) / eResults.length) : 0;
                const highest = eResults.length ? Math.max(...eResults.map((r) => r.percentage)) : 0;
                return (
                  <tr key={e.id}>
                    <td>{e.title}</td>
                    <td>{eResults.length}</td>
                    <td>{pass}/{eResults.length}</td>
                    <td>{avg ? avg + '%' : '—'}</td>
                    <td>{highest ? round1(highest) + '%' : '—'}</td>
                    <td><span className={`badge ${statusBadgeClass(e.status)}`}>{e.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <h2 className="mb-16">Export Options</h2>
        <div className="alert alert-info mb-16">Export functionality requires a backend server. In this demo, use Print to save as PDF.</div>
        <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => window.print()}>📄 Save as PDF</button>
          <button className="btn btn-outline" onClick={exportCSV}>📊 Export CSV</button>
          <button className="btn btn-outline" onClick={() => toast('Report emailed to admin@exampro.com', 'info')}>📧 Email Report</button>
        </div>
      </div>
    </AdminLayout>
  );
}
