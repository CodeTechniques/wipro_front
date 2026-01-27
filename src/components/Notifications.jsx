import React, { useEffect, useState } from 'react';
import { getRequest } from '../utils/api';


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getRequest(`${import.meta.env.VITE_PROPERTIES_ENDPOINT}/notifications/my/`);
        setNotifications(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <div className="loading">Loading notifications...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>

      {notifications.length === 0 ? (
        <p className="no-data">No notifications yet.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map(notif => (
            <li key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
              <div className="notification-body">
                <p>{notif.message}</p>
                <small>{new Date(notif.created_at).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
