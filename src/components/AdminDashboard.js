import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isNavVisible, setNavVisible] = useState(false);

  const toggleNavbar = () => {
    setNavVisible(!isNavVisible);
  };

  return (
    <div className="dashboard-container d-flex">
      <nav className={`sidebar ${isNavVisible ? 'show' : ''}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center">
          <h1 className="text-white">Dashboard</h1>
          {/* Show close button only on mobile view */}
          <button className="btn btn-close d-md-none" onClick={toggleNavbar}>
            Close
          </button>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/dashboard/home" className="nav-link text-white">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/items" className="nav-link text-white">Items</Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/packages" className="nav-link text-white">Packages</Link>
          </li>
        </ul>
      </nav>

      <main className={`content flex-grow-1 ${isNavVisible ? 'expanded' : ''}`}>
        {/* Show button only on mobile view */}
        <button className="btn btn-primary d-md-none mb-3" onClick={toggleNavbar}>
          {isNavVisible ? 'Hide Menu' : 'Show Menu'}
        </button>
        <div className="main-content mt-3">
          <Outlet /> {/* Render child routes here */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
