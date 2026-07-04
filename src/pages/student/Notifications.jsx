import { useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout.jsx';
import { DB } from '../../db.js';
import { useToast } from '../../Toast.jsx';

export default function StudentNotifications() {
  const toast = useToast();
  const [notifs, setNotifs] = useState(() => DB.get('notifications', []));

  function markRead(id) {
    const next = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifs(next);
    DB.set('notifications', next);
  }

  function markAllRead() {
    const next = notifs.map((n) => ({ ...n, read: true }));
    setNotifs(next);
    DB.set('notifications', next);
    toast('All notifications marked as read');
  }

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <StudentLayout title="Notifications">
      <div className="page-header"><h1>Notifications</h1><p>{unread} unread</p></div>

      <div className="panel" style={{ maxWidth: 680 }}>
        <div className="flex justify-between items-center mb-16">
          <h2>All Notifications</h2>
          <button className="btn btn-outline btn-sm" onClick={markAllRead}>✓ Mark all read</button>
        </div>
        <div>
          {notifs.map((n) => (
            <div className="notif-item" key={n.id}>
              <div className={`notif-dot ${n.read ? 'read' : ''}`} />
              <div>
                <div className={`notif-text ${n.read ? 'text-muted' : ''}`}>{n.text}</div>
                <div className="notif-time">{n.time}</div>
              </div>
              {!n.read && <button className="btn btn-ghost btn-sm" onClick={() => markRead(n.id)}>Mark read</button>}
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
