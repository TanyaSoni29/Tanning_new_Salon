import React, { useState } from "react";
import "./HeaderWithSidebar.css"; // CSS for Header and Sidebar

const HeaderWithSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="header-container">
      <div className="header">
        <div className="logo-section">
          <img src="../assets/img/new_logo.png" alt="Tanning Salon Logo" className="logo" />
          <span className="logo-text">Tanning Salon</span>
        </div>
        <div className="hamburger-icon" onClick={toggleSidebar}>
          <i className="fa fa-bars"></i>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-button" onClick={toggleSidebar}>
            <i className="fa fa-times"></i>
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>Dashboard</li>
          <li>Location</li>
          <li>Users</li>
          <li>Products</li>
          <li>Services</li>
          <li>Customers</li>
          <li>Transactions</li>
        </ul>
      </div>

      {/* Overlay */}
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default HeaderWithSidebar;
