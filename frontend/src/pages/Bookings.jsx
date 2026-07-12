import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { fetchBookings, fetchAssets, fetchUsers } from '../services/api';
import { FiCalendar, FiPlus } from 'react-icons/fi';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bkgs, asts, usrs] = await Promise.all([
          fetchBookings(),
          fetchAssets(),
          fetchUsers()
        ]);
        
        const assetMap = {};
        asts.forEach(a => assetMap[a.id] = a.name);
        
        const userMap = {};
        usrs.forEach(u => userMap[u.id] = u.name || u.email);

        const formatted = bkgs.map(b => ({
          id: `BKG-${b.id.toString().padStart(3, '0')}`,
          resource: assetMap[b.asset_id] || `Asset #${b.asset_id}`,
          employee: userMap[b.user_id] || `User #${b.user_id}`,
          startTime: new Date(b.start_time).toLocaleString(),
          endTime: new Date(b.end_time).toLocaleString(),
          status: 'Approved'
        }));
        
        setBookings(formatted);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const columns = [
    { header: 'Resource', accessor: 'resource' },
    { header: 'Employee', accessor: 'employee' },
    { header: 'Start Time', accessor: 'startTime' },
    { header: 'End Time', accessor: 'endTime' },
    { header: 'Status', render: (row) => (
      <span className={`badge badge-${row.status === 'Approved' ? 'success' : row.status === 'Pending' ? 'warning' : 'neutral'}`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="bookings-page animate-fade-in">
      <div className="page-header flex-between">
        <h1 className="page-title">Resource Bookings</h1>
        <button className="btn btn-primary"><FiPlus /> Book Resource</button>
      </div>

      <div className="bookings-grid">
        <div className="calendar-placeholder flex-center">
          <div className="placeholder-content">
            <FiCalendar className="placeholder-icon" />
            <h3>Calendar View</h3>
            <p>Interactive calendar component would appear here.</p>
          </div>
        </div>
        
        <div className="bookings-list">
          <div className="section-header">
            <h2>Recent Bookings</h2>
          </div>
          {isLoading ? (
            <p>Loading bookings...</p>
          ) : (
            <Table columns={columns} data={bookings} search={true} pagination={true} actions={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
