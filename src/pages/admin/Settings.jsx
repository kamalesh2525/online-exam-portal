import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { DB } from '../../db.js';
import { useToast } from '../../Toast.jsx';

export default function AdminSettings() {
  const toast = useToast();
  const saved = DB.get('settings', { portalName: 'EXAMPRO', maxDuration: 180, passPercent: 60 });
  const [cfg, setCfg] = useState({ name: saved.portalName, duration: saved.maxDuration, pass: saved.passPercent, inst: '' });

  function saveSettings() {
    DB.set('settings', { portalName: cfg.name, maxDuration: cfg.duration, passPercent: cfg.pass });
    toast('Settings saved');
  }

  return (
    <AdminLayout title="Settings">
      <div className="page-header"><h1>System Settings</h1><p>Configure portal-wide settings and defaults.</p></div>

      <div className="grid-2 gap-20">
        <div className="panel">
          <h2 className="mb-16">General Settings</h2>
          <div className="form-group"><label>Portal Name</label><input type="text" value={cfg.name} onChange={(e) => setCfg({ ...cfg, name: e.target.value })} /></div>
          <div className="form-group"><label>Max Exam Duration (minutes)</label><input type="number" value={cfg.duration} onChange={(e) => setCfg({ ...cfg, duration: e.target.value })} /></div>
          <div className="form-group"><label>Default Pass Percentage (%)</label><input type="number" value={cfg.pass} onChange={(e) => setCfg({ ...cfg, pass: e.target.value })} /></div>
          <div className="form-group"><label>Institution Name</label><input type="text" placeholder="e.g. VIT Chennai" value={cfg.inst} onChange={(e) => setCfg({ ...cfg, inst: e.target.value })} /></div>
          <button className="btn btn-primary" onClick={saveSettings}>Save Settings</button>
        </div>

        <div className="panel">
          <h2 className="mb-16">Admin Account</h2>
          <div className="form-group"><label>Admin Name</label><input type="text" defaultValue="Admin" /></div>
          <div className="form-group"><label>Email</label><input type="email" defaultValue="admin@exampro.com" /></div>
          <div className="form-group"><label>Current Password</label><input type="password" placeholder="••••••••" /></div>
          <div className="form-group"><label>New Password</label><input type="password" placeholder="••••••••" /></div>
          <div className="form-group"><label>Confirm Password</label><input type="password" placeholder="••••••••" /></div>
          <button className="btn btn-primary" onClick={() => toast('Password updated')}>Update Password</button>
        </div>

        <div className="panel">
          <h2 className="mb-16">Data Management</h2>
          <p className="text-muted mb-16" style={{ fontSize: 13 }}>Manage application data stored in this browser. Use with caution.</p>
          <div className="flex flex-col gap-12">
            <button className="btn btn-outline" onClick={() => toast('Data exported — check downloads', 'info')}>📤 Export All Data</button>
            <button className="btn btn-outline" onClick={() => { if (confirm('Reset all demo data?')) { DB.del('seeded'); location.reload(); } }}>🔄 Reset Demo Data</button>
            <button className="btn btn-danger" onClick={() => { if (confirm('Clear ALL data? This cannot be undone.')) { localStorage.clear(); location.reload(); } }}>🗑️ Clear All Data</button>
          </div>
        </div>

        <div className="panel">
          <h2 className="mb-16">Notification Settings</h2>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Email notifications for new results
            </label>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Exam reminder notifications
            </label>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" /> Weekly summary reports
            </label>
          </div>
          <button className="btn btn-primary mt-8" onClick={() => toast('Notification settings saved')}>Save Preferences</button>
        </div>
      </div>
    </AdminLayout>
  );
}
