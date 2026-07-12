import React, { useState } from 'react';
import Table from '../components/Table';
import { organizationData } from '../services/api';
import { FiPlus } from 'react-icons/fi';
import './Organization.css';

const Organization = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const { departments, employees } = organizationData;

  const deptColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Department Name', accessor: 'name' },
    { header: 'Head of Dept', accessor: 'head' },
    { header: 'Size', accessor: 'size' },
    { header: 'Status', render: (row) => (
      <span className="badge badge-success">{row.status}</span>
    )}
  ];

  const empColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    { header: 'Role', accessor: 'role' },
    { header: 'Status', render: (row) => (
      <span className={`badge badge-${row.status === 'Active' ? 'success' : 'warning'}`}>
        {row.status}
      </span>
    )}
  ];

  const categories = ['Electronics', 'Furniture', 'Vehicles', 'IT Equipment', 'Laboratory'];

  return (
    <div className="organization-page animate-fade-in">
      <div className="page-header flex-between">
        <h1 className="page-title">Organization Setup</h1>
        <button className="btn btn-primary">
          <FiPlus /> Add {activeTab === 'departments' ? 'Department' : activeTab === 'employees' ? 'Employee' : 'Category'}
        </button>
      </div>

      <div className="tabs-container">
        <div className={`tab ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => setActiveTab('departments')}>
          Departments
        </div>
        <div className={`tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
          Asset Categories
        </div>
        <div className={`tab ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
          Employee Directory
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'departments' && (
          <Table columns={deptColumns} data={departments} search={true} pagination={true} actions={true} />
        )}

        {activeTab === 'employees' && (
          <Table columns={empColumns} data={employees} search={true} pagination={true} actions={true} />
        )}

        {activeTab === 'categories' && (
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <div className="category-card" key={idx}>
                <h3>{cat}</h3>
                <p>Manage {cat.toLowerCase()} settings and custom fields.</p>
                <div className="cat-actions flex-between">
                  <span className="badge badge-neutral">Active</span>
                  <button className="btn-outline btn-sm">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Organization;
