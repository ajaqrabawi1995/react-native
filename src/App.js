// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';
import ItemsManagement from './components/ItemsManagement';
import PackagesManagement from './components/PackagesManagement';

import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const isAuthenticated = () => localStorage.getItem('token') !== null;

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" />}
      >
        <Route path="home" element={<Home />} />
        <Route path="items" element={<ItemsManagement />} />
        <Route path="packages" element={<PackagesManagement />} />
       
        <Route index element={<Navigate to="home" />} />
      </Route>

      {/* Redirect root path based on authentication status */}
      <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard/home" : "/login"} />} />

      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard/home" : "/login"} />} />
    </Routes>
  );
};

export default App;
