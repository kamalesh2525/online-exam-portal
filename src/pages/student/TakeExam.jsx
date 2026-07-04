import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DB, fmtTime, getCurrentStudentId, round1 } from '../../db.js';

export default function TakeExam() {
  const [params] = useSearchParams();
  const examId = params.get('id') || 'E003';
  const studentId = getCurrentStudentId();

  const exam = useMemo(() => {
    const exams = DB.get('exams', []);
    return exams.find((e) => e.id === examId) || exams[0];
  }, [examId]);

  const questions = useMemo(() => {
    if (!exam) return [];
    const qs = DB.get('questions', []);
    return qs.filter((q) => exam.questions.includes(q.id));
  }, [exam]);

  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exam ? exam.duration * 60 : 0);
  const [submitted, setSubmitted] = useState(null); // { status, pct, score, timeTaken }
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    if (!exam || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          doSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, submitted]);

  function selectAnswer(qId, idx) {
    setAnswers((a) => ({ ...a, [qId]: idx }));
  }

  function doSubmit() {
    clearInterval(timerRef.current);
    let score = 0;
    questions.forEach((q) => { if (answers[q.id] === q.correct) score += q.marks; });
    const pct = round1((score / exam.totalMarks) * 100);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 60000);
    const status = pct >= round1((exam.passMark / exam.totalMarks) * 100) ? 'Pass' : 'Fail';

    const results = DB.get('results', []);
    const id = 'R' + String(results.length + 1).padStart(3, '0');
    results.push({ id, studentId, examId: exam.id, score, total: exam.totalMarks, percentage: pct, status, timeTaken, date: new Date().toISOString().split('T')[0], answers });
    DB.set('results', results);

    setSubmitted({ status, pct, score, timeTaken });
  }

  if (!exam) {
    return (
      <div style={{ background: '#f9fafb', minHeight: '100vh', padding: 40 }}>
        <div className="empty"><h3>Exam not found</h3></div>
      </div>
    );
  }

  if (submitted) {
    const { status, pct, score, timeTaken } = submitted;
    return (
      <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{status === 'Pass' ? '🎉' : '😔'}</div>
          <h2 style={{ marginBottom: 8 }}>Exam {status === 'Pass' ? 'Passed!' : 'Failed'}</h2>
          <div style={{ fontSize: 40, fontWeight: 800, color: status === 'Pass' ? '#16a34a' : '#dc2626', margin: '16px 0' }}>{pct}%</div>
          <p style={{ color: '#6b7280', marginBottom: 4 }}>Score: {score} / {exam.totalMarks}</p>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>Time taken: {timeTaken} min</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/student/results" className="btn btn-primary">View Results</Link>
            <Link to="/student/exams" className="btn btn-outline">Back to Exams</Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const timerClass = timeLeft < 300 ? ' danger' : timeLeft < 600 ? ' warning' : '';

  return (
    <div style={{ background: '#f9fafb' }}>
      <style>{`
        .exam-header{background:var(--gray-900);color:white;padding:16px 28px;display:flex;align-items:center;justify-content:space-between}
        .exam-header h2{color:white;font-size:16px}
        .exam-body{max-width:760px;margin:0 auto;padding:32px 24px}
        .q-nav{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
        .q-dot{width:32px;height:32px;border-radius:6px;border:1.5px solid var(--gray-300);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;cursor:pointer;transition:.15s;color:var(--gray-600)}
        .q-dot.answered{background:var(--primary);border-color:var(--primary);color:white}
        .q-dot.current{border-color:var(--primary);color:var(--primary)}
      `}</style>

      <div className="exam-header">
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{exam.title}</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>{exam.subject} • {exam.duration} min • {exam.totalMarks} marks</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className={'timer-box' + timerClass}><span>⏱</span> <span>{fmtTime(timeLeft)}</span></div>
          <button className="btn btn-danger btn-sm" onClick={() => { if (confirm('Submit exam now?')) doSubmit(); }}>Submit</button>
        </div>
      </div>

      <div className="exam-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)' }}>Question {currentQ + 1} of {total}</span>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{answeredCount} answered</span>
        </div>
        <div className="progress-bar mb-24" style={{ height: 6 }}>
          <div className="progress-fill progress-blue" style={{ width: `${((currentQ + 1) / total) * 100}%` }} />
        </div>

        {q && (
          <div className="card" style={{ padding: 28, marginBottom: 20 }}>
            <div className="q-num">Question {currentQ + 1}</div>
            <div className="q-text">{q.text}</div>
            <div className="options">
              {q.options.map((opt, i) => (
                <label key={i} className={`option-label ${answers[q.id] === i ? 'selected' : ''}`} onClick={() => selectAnswer(q.id, i)}>
                  <input type="radio" name="q" checked={answers[q.id] === i} readOnly /> {String.fromCharCode(65 + i)}. {opt}
                </label>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-outline" disabled={currentQ === 0} onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}>← Previous</button>
          <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>Click an option to select, then click Next</div>
          <button className="btn btn-primary" onClick={() => (currentQ < total - 1 ? setCurrentQ((c) => c + 1) : doSubmit())}>
            {currentQ === total - 1 ? 'Submit Exam' : 'Next →'}
          </button>
        </div>

        <div className="panel mt-24">
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 10 }}>Question Navigator</div>
          <div className="q-nav">
            {questions.map((qq, i) => (
              <div
                key={qq.id}
                className={`q-dot ${i === currentQ ? 'current' : ''} ${answers[qq.id] !== undefined ? 'answered' : ''}`}
                onClick={() => setCurrentQ(i)}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
