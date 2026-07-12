import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import Card from '../components/Card';
import { fetchAssets } from '../services/api';
import { FiTool, FiAlertTriangle, FiCheckCircle, FiActivity } from 'react-icons/fi';
import './Maintenance.css';

const Maintenance = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const assets = await fetchAssets();
        const underMaintenance = assets.filter(a => a.status.toLowerCase() === 'maintenance');
        const formatted = underMaintenance.map(a => ({
          id: `MNT-${a.id}`,
          asset: a.name,
          issue: 'General Servicing',
          priority: 'Medium',
          technician: 'IT Support',
          status: 'In Progress'
        }));
        setMaintenanceData(formatted);
      } catch (err) {
        console.error("Failed to fetch maintenance", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

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
        <Card title="Pending" icon={FiAlertTriangle} value={isLoading ? "-" : "0"} subtitle="Requires Approval" />
        <Card title="Approved" icon={FiCheckCircle} value={isLoading ? "-" : "0"} subtitle="Waiting for technician" />
        <Card title="In Progress" icon={FiActivity} value={isLoading ? "-" : maintenanceData.length} subtitle="Currently in repair" />
        <Card title="Resolved" icon={FiTool} value={isLoading ? "-" : "0"} subtitle="Completed this month" />
      </div>

      <div className="maintenance-list">
        {isLoading ? <p>Loading maintenance records...</p> : <Table columns={columns} data={maintenanceData} search={true} pagination={true} actions={true} />}
      </div>
    </div>
  );
};

export default Maintenance;
