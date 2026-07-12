import React from 'react';
import { FiSearch, FiBell, FiSettings } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: 'admin@assetflow.com' };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-search">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Global Search..." />
        </div>
      </div>
      <div className="navbar-right">
        <button className="icon-btn">
          <FiBell />
          <span className="notification-badge"></span>
        </button>
        <button className="icon-btn">
          <FiSettings />
        </button>
        <div className="user-profile">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=4F46E5&color=fff" alt="User Avatar" className="avatar" />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
