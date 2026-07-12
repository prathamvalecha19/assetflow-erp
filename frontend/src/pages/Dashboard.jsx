import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Table from '../components/Table';
import { fetchAssets, fetchBookings } from '../services/api';
import { FiBox, FiCheckCircle, FiTool, FiCalendar, FiRefreshCw, FiClock, FiPlus } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState({
    assetsAvailable: { value: '-', trend: '+0%', status: 'success' },
    assetsAllocated: { value: '-', trend: '+0%', status: 'warning' },
    maintenanceToday: { value: '-', trend: '-0%', status: 'danger' },
    activeBookings: { value: '-', trend: '+0%', status: 'primary' },
    pendingTransfers: { value: '-', trend: '-0%', status: 'warning' },
    upcomingReturns: { value: '-', trend: '+0%', status: 'success' }
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [asts, bkgs] = await Promise.all([fetchAssets(), fetchBookings()]);

        let available = 0, allocated = 0, maint = 0;
        asts.forEach(a => {
          if (a.status.toLowerCase() === 'available') available++;
          if (a.status.toLowerCase() === 'allocated') allocated++;
          if (a.status.toLowerCase() === 'maintenance') maint++;
        });

        setKpis({
          assetsAvailable: { value: available, trend: '+5%', status: 'success' },
          assetsAllocated: { value: allocated, trend: '+2%', status: 'warning' },
          maintenanceToday: { value: maint, trend: '-3%', status: 'danger' },
          activeBookings: { value: bkgs.length, trend: '+12%', status: 'primary' },
          pendingTransfers: { value: 0, trend: '-0%', status: 'warning' },
          upcomingReturns: { value: 0, trend: '+0%', status: 'success' }
        });

        // Mock recent activity since backend doesn't store logs
        setRecentActivity([
          { id: 1, action: 'Dashboard Refreshed', item: 'System', user: 'Admin', time: 'Just now', status: 'completed' }
        ]);

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    loadDashboard();
  }, []);

  const columns = [
    { header: 'Action', accessor: 'action' },
    { header: 'Item', accessor: 'item' },
    { header: 'User', accessor: 'user' },
    { header: 'Time', accessor: 'time' },
    {
      header: 'Status', render: (row) => (
        <span className={`badge badge-${row.status === 'completed' ? 'success' : 'warning'}`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header flex-between">
        <h1 className="page-title">Dashboard Overview</h1>
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => navigate('/assets')}><FiPlus /> Register Asset</button>
          <button className="btn btn-outline" onClick={() => navigate('/bookings')}><FiCalendar /> Book Resource</button>
        </div>
      </div>

      <div className="kpi-grid">
        <Card title="Assets Available" icon={FiCheckCircle} value={kpis.assetsAvailable.value} trend={kpis.assetsAvailable.trend} trendColor={kpis.assetsAvailable.status} />
        <Card title="Assets Allocated" icon={FiBox} value={kpis.assetsAllocated.value} trend={kpis.assetsAllocated.trend} trendColor={kpis.assetsAllocated.status} />
        <Card title="Maintenance Today" icon={FiTool} value={kpis.maintenanceToday.value} trend={kpis.maintenanceToday.trend} trendColor={kpis.maintenanceToday.status} />
        <Card title="Active Bookings" icon={FiCalendar} value={kpis.activeBookings.value} trend={kpis.activeBookings.trend} trendColor={kpis.activeBookings.status} />
        <Card title="Pending Transfers" icon={FiRefreshCw} value={kpis.pendingTransfers.value} trend={kpis.pendingTransfers.trend} trendColor={kpis.pendingTransfers.status} />
        <Card title="Upcoming Returns" icon={FiClock} value={kpis.upcomingReturns.value} trend={kpis.upcomingReturns.trend} trendColor={kpis.upcomingReturns.status} />
      </div>

      <div className="dashboard-content-grid">
        <div className="recent-activity-section">
          <div className="section-header flex-between">
            <h2>Recent Activity</h2>
            <button className="btn btn-outline btn-sm">View All</button>
          </div>
          <Table columns={columns} data={recentActivity} actions={false} search={false} pagination={false} />
        </div>

        <div className="notifications-panel">
          <h2>Notifications & Alerts</h2>
          <div className="notification-list">
            <div className="alert-item alert-danger">
              <div className="alert-icon"><FiTool /></div>
              <div className="alert-content">
                <strong>Critical Maintenance</strong>
                <p>Server Rack B requires immediate cooling check.</p>
              </div>
            </div>
            <div className="alert-item alert-warning">
              <div className="alert-icon"><FiClock /></div>
              <div className="alert-content">
                <strong>Overdue Returns</strong>
                <p>3 Items are past their return date.</p>
              </div>
            </div>
            <div className="alert-item alert-success">
              <div className="alert-icon"><FiCheckCircle /></div>
              <div className="alert-content">
                <strong>System Update</strong>
                <p>Asset inventory synchronization completed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
