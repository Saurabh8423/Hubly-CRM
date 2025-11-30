import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <div className="dashboard-content">
          <Outlet />   
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
