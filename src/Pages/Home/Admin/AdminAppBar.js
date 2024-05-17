import React from "react";
import "./AdminAppBar.css"; // Import your CSS file
import { LucideUserCircle } from "lucide-react";
const AdminAppBar = () => {
  return (
    <div className="admin-app-bar">
      <div className="admin-title">Discussion Forum</div>
      <div className="admin-user">
        <LucideUserCircle
          strokeWidth={1.5}
          style={{ opacity: 0.9, width: "60", height: "90" }}
        />
        <span>Admin</span>
      </div>
    </div>
  );
};

export default AdminAppBar;
