import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import MiniVerticalNav from "../components/MiniVerticalNav";

export default function DashboardLayout() {
  return (
    <>
      {/* TOP NAVBAR */}
      <Navbar />

      {/* MAIN LAYOUT */}
      <div className="dashboard-layout">
        {/* LEFT SIDEBAR */}
        <MiniVerticalNav />

        {/* PAGE CONTENT */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}
