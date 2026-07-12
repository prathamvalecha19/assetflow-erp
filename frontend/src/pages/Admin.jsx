import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { fetchUsers } from '../services/api';
import { FiShield, FiUserPlus, FiLock } from 'react-icons/fi';
import './Organization.css'; // Reusing some base page styles

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData.map(u => ({
          ...u,
          name: u.name || 'No Name',
          departmentName: u.department ? u.department.name : 'Unassigned',
          badgeRole: u.role === 'admin' ? 'Administrative' : 'Standard User'
        })));
      } catch (err) {
        console.error("Failed to load users data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  const adminColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Username', accessor: 'name' },
    { header: 'Email Address', accessor: 'email' },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Role Type', render: (row) => (
      <span className={"" + (row.role === 'admin' ? 'badge badge-primary' : 'badge badge-neutral')}>
        {row.role === 'admin' ? <FiShield style={{marginRight: '4px'}}/> : null}
        {row.badgeRole}
      </span>
    )}
  ];

  return (
    <div className="organization-page animate-fade-in">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Admin Control Panel</h1>
          <p style={{color: '#64748B', marginTop: '8px'}}>Manage all registered user data and system roles across the platform.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiUserPlus /> Create New User
        </button>
      </div>

      <div className="tab-content" style={{ marginTop: '30px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiLock style={{ color: '#4F46E5' }} /> User Database
          </h2>
          {isLoading ? (
            <p>Loading internal user schema...</p>
          ) : (
            <Table columns={adminColumns} data={users} search={true} pagination={true} actions={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
