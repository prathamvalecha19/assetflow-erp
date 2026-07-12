import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiBox, FiCalendar, FiTool, FiLogOut, FiMenu, FiShield } from 'react-icons/fi';
import { logout } from '../services/auth';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FiGrid /> },
    { path: '/organization', name: 'Organization', icon: <FiUsers /> },
    { path: '/assets', name: 'Assets', icon: <FiBox /> },
    { path: '/bookings', name: 'Bookings', icon: <FiCalendar /> },
    { path: '/maintenance', name: 'Maintenance', icon: <FiTool /> },
    { path: '/admin', name: 'Admin Panel', icon: <FiShield /> },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <div className="brand">AssetFlow</div>}
        {collapsed && <div className="brand-collapsed">AF</div>}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <FiMenu />
        </button>
      </div>

      <div className="sidebar-menu">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.name : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.name}</span>}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : ''}>
          <span className="nav-icon"><FiLogOut /></span>
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
