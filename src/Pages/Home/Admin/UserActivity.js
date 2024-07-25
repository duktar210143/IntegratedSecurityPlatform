import React, { useState, useEffect } from "react";
import axios from "axios";

const UserActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("/admin/user-activity-logs");
        setLogs(response.data.logs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2>User Activity Logs</h2>
      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log._id}>
              <strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}<br />
              <strong>Username:</strong> {log.message.match(/Username: (.+?)\n/)[1]}<br />
              <strong>Session ID:</strong> {log.message.match(/Session ID: (.+?)\n/)[1]}<br />
              <strong>URL:</strong> {log.message.match(/URL: (.+?)\n/)[1]}<br />
              <strong>Method:</strong> {log.message.match(/Method: (.+?)$/)[1]}<br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserActivityLogs;
