import React from 'react';
import Table from '../components/Table';
import Card from '../components/Card';
import { maintenanceData } from '../services/api';
import { FiTool, FiAlertTriangle, FiCheckCircle, FiActivity } from 'react-icons/fi';
import './Maintenance.css';

const Maintenance = () => {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Asset', accessor: 'asset' },
    { header: 'Issue', accessor: 'issue' },
    { header: 'Priority', render: (row) => (
      <span className={`badge badge-${row.priority === 'High' ? 'danger' : row.priority === 'Medium' ? 'warning' : 'success'}`}>
        {row.priority}
      </span>
    )},
    { header: 'Technician', accessor: 'technician' },
    { header: 'Status', render: (row) => (
      <span className={`badge badge-${row.status === 'Resolved' ? 'success' : row.status === 'In Progress' ? 'primary' : 'warning'}`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="maintenance-page animate-fade-in">
      <div className="page-header flex-between">
        <h1 className="page-title">Maintenance Requests</h1>
        <button className="btn btn-primary"><FiTool /> Raise Request</button>
      </div>

      <div className="kpi-grid">
        <Card title="Pending" icon={FiAlertTriangle} value="8" subtitle="Requires Approval" />
        <Card title="Approved" icon={FiCheckCircle} value="12" subtitle="Waiting for technician" />
        <Card title="In Progress" icon={FiActivity} value="5" subtitle="Currently in repair" />
        <Card title="Resolved" icon={FiTool} value="34" subtitle="Completed this month" />
      </div>

      <div className="maintenance-list">
        <Table columns={columns} data={maintenanceData} search={true} pagination={true} actions={true} />
      </div>
    </div>
  );
};

export default Maintenance;
