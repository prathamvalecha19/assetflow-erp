import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { getBookings, getAssets, createBooking } from '../services/api';
import { FiCalendar, FiPlus, FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Calendar states
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    // Set to Monday of this week
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  });
  const [selectedDay, setSelectedDay] = useState(new Date());

  const loadData = async () => {
    setLoading(true);
    try {
      const bData = await getBookings();
      const aData = await getAssets();
      setBookings(bData || []);
      setAssets(aData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Generate 7 days of the current week
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  // Filter bookings for the selected day
  const getSelectedDayBookings = () => {
    return bookings.filter(b => {
      const bDate = new Date(b.start_time || b.startTime);
      return bDate.toDateString() === selectedDay.toDateString() && b.status !== "Cancelled";
    });
  };

  const selectedDayBookings = getSelectedDayBookings();

  // Helper date formatter
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedAssetId || !startTime || !endTime) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      setErrorMsg('End time must be after start time.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await createBooking({
        asset_id: parseInt(selectedAssetId),
        start_time: start.toISOString(),
        end_time: end.toISOString()
      });

      if (result.success) {
        setSuccessMsg('Resource booked successfully!');
        setSelectedAssetId('');
        setStartTime('');
        setEndTime('');
        // Reload data
        await loadData();
        setTimeout(() => {
          setShowModal(false);
          setSuccessMsg('');
        }, 1500);
      } else {
        setErrorMsg(result.error || 'Failed to create booking.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { header: 'Resource / Asset', accessor: 'resource' },
    { header: 'Employee', accessor: 'employee' },
    { header: 'Start Time', render: (row) => formatDateTime(row.start_time || row.startTime) },
    { header: 'End Time', render: (row) => formatDateTime(row.end_time || row.endTime) },
    { header: 'Status', render: (row) => (
      <span className={`badge badge-${row.status === 'Approved' ? 'success' : row.status === 'Pending' ? 'warning' : row.status === 'Completed' ? 'primary' : 'neutral'}`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="bookings-page animate-fade-in">
      <div className="page-header flex-between">
        <h1 className="page-title">Resource Bookings</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> Book Resource
        </button>
      </div>

      <div className="bookings-grid">
        {/* Calendar Card */}
        <div className="calendar-view">
          <div className="calendar-header-nav">
            <h3>{currentWeekStart.toLocaleString([], { month: 'long', year: 'numeric' })}</h3>
            <div className="nav-buttons">
              <button className="btn btn-outline btn-sm" onClick={handlePrevWeek}><FiChevronLeft /></button>
              <button className="btn btn-outline btn-sm" onClick={handleNextWeek}><FiChevronRight /></button>
            </div>
          </div>

          <div className="week-grid">
            {weekDays.map((day, idx) => {
              const isActive = day.toDateString() === selectedDay.toDateString();
              const dayHasBooking = bookings.some(b => {
                const bDate = new Date(b.start_time || b.startTime);
                return bDate.toDateString() === day.toDateString() && b.status !== "Cancelled";
              });
              return (
                <div 
                  key={idx} 
                  className={`day-column ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className="day-name">{day.toLocaleString([], { weekday: 'short' })}</span>
                  <div className="day-date">{day.getDate()}</div>
                  {dayHasBooking && <div className="day-booking-indicator" style={{ color: isActive ? '#fff' : '#4f46e5' }}></div>}
                </div>
              );
            })}
          </div>

          <div className="daily-schedule-list">
            <h4 className="daily-schedule-title">
              Schedule for {selectedDay.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </h4>
            
            {selectedDayBookings.length > 0 ? (
              selectedDayBookings.map((b) => (
                <div key={b.id} className="schedule-card animate-fade-in">
                  <div className="schedule-time">
                    {new Date(b.start_time || b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="schedule-details">
                    <div className="schedule-resource">{b.resource}</div>
                    <div className="schedule-employee">Booked by: {b.employee}</div>
                  </div>
                  <span className={`badge badge-sm badge-${b.status === 'Approved' ? 'success' : b.status === 'Pending' ? 'warning' : 'neutral'}`}>
                    {b.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="schedule-empty">
                <FiCalendar className="placeholder-icon" style={{ fontSize: '24px', marginBottom: '8px' }} />
                <p>No bookings scheduled for this day.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Bookings List Table */}
        <div className="bookings-list">
          <div className="section-header">
            <h2>All Reservations</h2>
          </div>
          {loading ? (
            <div className="flex-center" style={{ height: '200px' }}>Loading bookings...</div>
          ) : (
            <Table columns={columns} data={bookings} search={true} pagination={true} actions={false} />
          )}
        </div>
      </div>

      {/* Book Resource Dialog Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book a Resource</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>Ã—</button>
            </div>
            
            <form onSubmit={handleBook}>
              <div className="modal-body">
                {errorMsg && (
                  <div className="error-alert">
                    <FiAlertCircle />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="success-alert">
                    {successMsg}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="resource">Select Resource / Asset</label>
                  <select 
                    id="resource" 
                    className="form-input"
                    value={selectedAssetId}
                    onChange={e => setSelectedAssetId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Asset --</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} ({asset.category}) - {asset.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="start_time">Start Date & Time</label>
                  <input 
                    type="datetime-local" 
                    id="start_time"
                    className="form-input"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_time">End Date & Time</label>
                  <input 
                    type="datetime-local" 
                    id="end_time"
                    className="form-input"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
