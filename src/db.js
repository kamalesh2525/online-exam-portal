// ── EXAMPRO — Data layer (localStorage) ──

export const DB = {
  get(k, def) {
    try {
      const v = localStorage.getItem('ep_' + k);
      return v ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  },
  set(k, v) {
    localStorage.setItem('ep_' + k, JSON.stringify(v));
  },
  del(k) {
    localStorage.removeItem('ep_' + k);
  },
};

export const STUDENT_ID_KEY = 'currentStudentId';
export function getCurrentStudentId() {
  return DB.get(STUDENT_ID_KEY, 'S001');
}
export function setCurrentStudentId(id) {
  DB.set(STUDENT_ID_KEY, id);
}

// ── Seed default data ──
export function seedData() {
  if (DB.get('seeded')) return;

  DB.set('students', [
    { id: 'S001', name: 'Kamalesh R', email: 'kamalesh@student.com', dept: 'Computer Science', year: '3rd Year', gpa: '8.7', avatar: 'KR', phone: '9876543210', enrolled: '2022-07-01' },
    { id: 'S002', name: 'Priya Nair', email: 'priya@student.com', dept: 'Electronics', year: '2nd Year', gpa: '9.1', avatar: 'PN', phone: '9876543211', enrolled: '2023-07-01' },
    { id: 'S003', name: 'Arjun Menon', email: 'arjun@student.com', dept: 'Mechanical', year: '4th Year', gpa: '7.8', avatar: 'AM', phone: '9876543212', enrolled: '2021-07-01' },
    { id: 'S004', name: 'Sana Begum', email: 'sana@student.com', dept: 'Civil', year: '1st Year', gpa: '8.2', avatar: 'SB', phone: '9876543213', enrolled: '2024-07-01' },
    { id: 'S005', name: 'Rahul Das', email: 'rahul@student.com', dept: 'Computer Science', year: '3rd Year', gpa: '8.9', avatar: 'RD', phone: '9876543214', enrolled: '2022-07-01' },
    { id: 'S006', name: 'Meera Pillai', email: 'meera@student.com', dept: 'Electronics', year: '2nd Year', gpa: '7.5', avatar: 'MP', phone: '9876543215', enrolled: '2023-07-01' },
  ]);

  DB.set('questions', [
    { id: 'Q001', subject: 'Database Management', text: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Sequential Query Language', 'Standard Query Language'], correct: 0, difficulty: 'Easy', marks: 2 },
    { id: 'Q002', subject: 'Database Management', text: 'Which SQL command is used to retrieve data from a database?', options: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'], correct: 1, difficulty: 'Easy', marks: 2 },
    { id: 'Q003', subject: 'Database Management', text: 'What is a primary key?', options: ['A key that allows duplicate values', 'A unique identifier for each record', 'A foreign key reference', 'An index on a column'], correct: 1, difficulty: 'Medium', marks: 3 },
    { id: 'Q004', subject: 'Database Management', text: 'Which of the following is NOT a type of JOIN in SQL?', options: ['INNER JOIN', 'OUTER JOIN', 'CROSS JOIN', 'DIAGONAL JOIN'], correct: 3, difficulty: 'Medium', marks: 3 },
    { id: 'Q005', subject: 'Database Management', text: 'What is normalization in databases?', options: ['Encrypting data', 'Organizing data to reduce redundancy', 'Compressing data', 'Backing up data'], correct: 1, difficulty: 'Hard', marks: 4 },
    { id: 'Q006', subject: 'Data Structures', text: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correct: 1, difficulty: 'Easy', marks: 2 },
    { id: 'Q007', subject: 'Data Structures', text: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correct: 2, difficulty: 'Medium', marks: 3 },
    { id: 'Q008', subject: 'Data Structures', text: 'Which sorting algorithm has the worst case complexity of O(n log n)?', options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], correct: 2, difficulty: 'Hard', marks: 4 },
    { id: 'Q009', subject: 'Operating Systems', text: 'What is a deadlock?', options: ['A system crash', 'A situation where processes wait indefinitely for resources', 'A memory overflow', 'A network timeout'], correct: 1, difficulty: 'Medium', marks: 3 },
    { id: 'Q010', subject: 'Operating Systems', text: 'Which scheduling algorithm gives the minimum average waiting time?', options: ['FCFS', 'Round Robin', 'SJF', 'Priority'], correct: 2, difficulty: 'Hard', marks: 4 },
    { id: 'Q011', subject: 'Computer Networks', text: 'What does HTTP stand for?', options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Hyper Transfer Text Process', 'HyperText Transmission Process'], correct: 0, difficulty: 'Easy', marks: 2 },
    { id: 'Q012', subject: 'Computer Networks', text: 'Which layer of the OSI model handles routing?', options: ['Data Link', 'Transport', 'Network', 'Session'], correct: 2, difficulty: 'Medium', marks: 3 },
  ]);

  DB.set('exams', [
    { id: 'E001', title: 'DBMS Midterm', subject: 'Database Management', duration: 60, totalMarks: 30, passMark: 18, date: '2025-01-20', time: '10:00', status: 'Completed', questions: ['Q001', 'Q002', 'Q003', 'Q004', 'Q005'], created: '2025-01-01' },
    { id: 'E002', title: 'Data Structures Final', subject: 'Data Structures', duration: 90, totalMarks: 45, passMark: 27, date: '2025-02-10', time: '14:00', status: 'Completed', questions: ['Q006', 'Q007', 'Q008'], created: '2025-01-15' },
    { id: 'E003', title: 'OS Unit Test', subject: 'Operating Systems', duration: 45, totalMarks: 20, passMark: 12, date: '2025-03-05', time: '11:00', status: 'Active', questions: ['Q009', 'Q010'], created: '2025-02-20' },
    { id: 'E004', title: 'Computer Networks Quiz', subject: 'Computer Networks', duration: 30, totalMarks: 15, passMark: 9, date: '2025-03-18', time: '09:00', status: 'Upcoming', questions: ['Q011', 'Q012'], created: '2025-03-01' },
    { id: 'E005', title: 'DBMS Final', subject: 'Database Management', duration: 120, totalMarks: 60, passMark: 36, date: '2025-04-02', time: '10:00', status: 'Upcoming', questions: ['Q001', 'Q002', 'Q003', 'Q004', 'Q005'], created: '2025-03-10' },
  ]);

  DB.set('results', [
    { id: 'R001', studentId: 'S001', examId: 'E001', score: 26, total: 30, percentage: 86.7, status: 'Pass', timeTaken: 52, date: '2025-01-20', answers: { Q001: 0, Q002: 1, Q003: 1, Q004: 3, Q005: 1 } },
    { id: 'R002', studentId: 'S001', examId: 'E002', score: 39, total: 45, percentage: 86.7, status: 'Pass', timeTaken: 81, date: '2025-02-10', answers: { Q006: 1, Q007: 2, Q008: 2 } },
    { id: 'R003', studentId: 'S002', examId: 'E001', score: 28, total: 30, percentage: 93.3, status: 'Pass', timeTaken: 45, date: '2025-01-20', answers: { Q001: 0, Q002: 1, Q003: 1, Q004: 3, Q005: 1 } },
    { id: 'R004', studentId: 'S003', examId: 'E001', score: 16, total: 30, percentage: 53.3, status: 'Fail', timeTaken: 60, date: '2025-01-20', answers: { Q001: 0, Q002: 1, Q003: 0, Q004: 2, Q005: 0 } },
    { id: 'R005', studentId: 'S002', examId: 'E002', score: 42, total: 45, percentage: 93.3, status: 'Pass', timeTaken: 72, date: '2025-02-10', answers: { Q006: 1, Q007: 2, Q008: 2 } },
    { id: 'R006', studentId: 'S001', examId: 'E003', score: 17, total: 20, percentage: 85, status: 'Pass', timeTaken: 38, date: '2025-03-05', answers: { Q009: 1, Q010: 2 } },
  ]);

  DB.set('notifications', [
    { id: 'N001', text: 'DBMS Final exam is scheduled on April 2, 2025 at 10:00 AM.', time: '2h ago', read: false, type: 'exam' },
    { id: 'N002', text: 'Your result for OS Unit Test has been published. Score: 85%.', time: '1d ago', read: false, type: 'result' },
    { id: 'N003', text: 'Computer Networks Quiz is on March 18. Prepare accordingly.', time: '2d ago', read: true, type: 'exam' },
    { id: 'N004', text: 'Question bank for Data Structures has been updated.', time: '3d ago', read: true, type: 'info' },
    { id: 'N005', text: 'Your certificate for DBMS Midterm is ready to download.', time: '5d ago', read: true, type: 'cert' },
  ]);

  DB.set('seeded', true);
}

// ── Helpers ──
export function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function fmtTime(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
export function round1(n) {
  return Math.round(n * 10) / 10;
}

const badgeMap = { Pass: 'badge-green', Fail: 'badge-red', Active: 'badge-blue', Upcoming: 'badge-orange', Completed: 'badge-gray' };
const diffMap = { Easy: 'badge-green', Medium: 'badge-orange', Hard: 'badge-red' };

export function statusBadgeClass(s) {
  return badgeMap[s] || 'badge-gray';
}
export function diffBadgeClass(d) {
  return diffMap[d] || 'badge-gray';
}
