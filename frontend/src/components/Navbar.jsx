import React, { useState } from 'react';
import { FiSearch, FiBell, FiSettings } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || { name: 'Admin', email: 'admin@assetflow.com', role: 'Employee' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name: tempName };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsSettingsOpen(false);
    window.location.reload();
  };

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
        <button className="icon-btn" onClick={() => setIsSettingsOpen(true)}>
          <FiSettings />
        </button>
        <div className="user-profile">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4F46E5&color=fff`} alt="User Avatar" className="avatar" />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role || 'Employee'}</span>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="modal-overlay navbar-settings-modal" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h2>User Settings</h2>
              <button className="close-btn" onClick={() => setIsSettingsOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSaveSettings}>
              <div className="modal-body" style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px'}}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-color)', textAlign: 'left' }}>Profile Name</label>
                  <input type="text" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} value={tempName} onChange={e => setTempName(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-color)', textAlign: 'left' }}>Email Address</label>
                  <input type="email" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9' }} value={user.email} disabled />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-color)', textAlign: 'left' }}>System Role</label>
                  <input type="text" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9' }} value={user.role || 'Employee'} disabled />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-color)' }}>Dark Mode (Simulation)</span>
                  <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsSettingsOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ marginLeft: '10px' }}>Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
