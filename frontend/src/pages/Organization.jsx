import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { fetchDepartments, fetchUsers, fetchCategories } from '../services/api';
import { FiPlus } from 'react-icons/fi';
import './Organization.css';

const Organization = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [depts, users, cats] = await Promise.all([
          fetchDepartments(),
          fetchUsers(),
          fetchCategories()
        ]);
        
        setDepartments(depts.map(d => ({
          ...d,
          head: 'Unassigned', // Backend doesn't have head
          size: '-',
          status: 'Active'
        })));
        
        setEmployees(users.map(u => ({
          ...u,
          name: u.name || 'No Name',
          department: u.department?.name || 'Unassigned',
          status: 'Active'
        })));
        
        setCategories(cats);
        
      } catch (err) {
        console.error("Failed to load organization data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

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
        {isLoading ? (
          <p>Loading data...</p>
        ) : (
          <>
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
                    <h3>{cat.name}</h3>
                    <p>{cat.description || `Manage ${cat.name.toLowerCase()} settings and custom fields.`}</p>
                    <div className="cat-actions flex-between">
                      <span className="badge badge-neutral">Active</span>
                      <button className="btn-outline btn-sm">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Organization;
