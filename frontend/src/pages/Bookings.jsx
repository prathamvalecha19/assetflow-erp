import React from 'react';
import Table from '../components/Table';
import { bookingsData } from '../services/api';
import { FiCalendar, FiPlus } from 'react-icons/fi';
import './Bookings.css';

const Bookings = () => {
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
          <Table columns={columns} data={bookingsData} search={true} pagination={true} actions={true} />
        </div>
      </div>
    </div>
  );
};

export default Bookings;
