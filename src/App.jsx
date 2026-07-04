import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { seedData } from './db.js';
import { ToastProvider } from './Toast.jsx';

import Login from './pages/Login.jsx';


import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminStudents from './pages/admin/Students.jsx';
import AdminExams from './pages/admin/Exams.jsx';
import AdminQuestionBank from './pages/admin/QuestionBank.jsx';
import AdminResults from './pages/admin/Results.jsx';
import AdminReports from './pages/admin/Reports.jsx';
import AdminSettings from './pages/admin/Settings.jsx';

import StudentDashboard from './pages/student/Dashboard.jsx';
import StudentExams from './pages/student/Exams.jsx';
import TakeExam from './pages/student/TakeExam.jsx';
import StudentResults from './pages/student/Results.jsx';
import StudentHistory from './pages/student/History.jsx';
import StudentNotifications from './pages/student/Notifications.jsx';
import StudentCertificates from './pages/student/Certificates.jsx';
import StudentProfile from './pages/student/Profile.jsx';

export default function App() {
  useEffect(() => {
    seedData();
  }, []);

  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/exams" element={<AdminExams />} />
        <Route path="/admin/questionbank" element={<AdminQuestionBank />} />
        <Route path="/admin/results" element={<AdminResults />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        {/* <Route path="/admin/settings" element={<AdminSettings />} /> */}

        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/exams" element={<StudentExams />} />
        <Route path="/student/takeexam" element={<TakeExam />} />
        <Route path="/student/results" element={<StudentResults />} />
        <Route path="/student/history" element={<StudentHistory />} />
        <Route path="/student/notifications" element={<StudentNotifications />} />
        <Route path="/student/certificates" element={<StudentCertificates />} />
        <Route path="/student/profile" element={<StudentProfile />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}
