import './NotificationBadge.css'
const NotificationBadge = ({ count }) => (
    <div className="notification-badge">
      {count > 0 && (
        <span className="badge">{count}</span>
      )}
    </div>
  );
  
  export default NotificationBadge;