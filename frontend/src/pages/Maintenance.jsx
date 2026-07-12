import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import Card from '../components/Card';
import { getMaintenance, getAssets, createMaintenance, updateMaintenanceStatus } from '../services/api';
import { FiTool, FiAlertTriangle, FiCheckCircle, FiActivity, FiPlus, FiAlertCircle } from 'react-icons/fi';
import './Maintenance.css';

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [technician, setTechnician] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const rData = await getMaintenance();
      const aData = await getAssets();
      setRequests(rData || []);
      setAssets(aData || []);
    } catch (e) {
      console.error("Error loading maintenance data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute KPI counts dynamically
  const getKpis = () => {
    const kpis = {
      pending: 0,
      approved: 0,
      inProgress: 0,
      resolved: 0
    };
    requests.forEach(r => {
      const status = r.status ? r.status.toLowerCase() : '';
      if (status === 'pending') kpis.pending++;
      else if (status === 'approved') kpis.approved++;
      else if (status === 'in progress') kpis.inProgress++;
      else if (status === 'resolved') kpis.resolved++;
    });
    return kpis;
  };

  const kpis = getKpis();

  const handleStatusUpdate = async (id, nextStatus) => {
    try {
      const res = await updateMaintenanceStatus(id, { status: nextStatus });
      if (res && res.success) {
        await loadData();
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const handleRaiseRequest = async (e) => {
    e.preventDefault();
    if (!selectedAssetId || !issue) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await createMaintenance({
        asset_id: parseInt(selectedAssetId),
        issue,
        priority,
        technician: technician || '-'
      });

      if (result && result.success) {
        setSuccessMsg('Maintenance request raised successfully!');
        setSelectedAssetId('');
        setIssue('');
        setPriority('Medium');
        setTechnician('');
        await loadData();
        setTimeout(() => {
          setShowModal(false);
          setSuccessMsg('');
        }, 1500);
      } else {
        setErrorMsg('Failed to raise maintenance request.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { header: 'Request ID', render: (row) => `MNT-${row.id}` },
    { header: 'Asset / Resource', accessor: 'asset' },
    { header: 'Issue / Description', accessor: 'issue' },
    { header: 'Priority', render: (row) => (
      <span className={`badge badge-${row.priority === 'High' ? 'danger' : row.priority === 'Medium' ? 'warning' : 'success'}`}>
        {row.priority}
      </span>
    )},
    { header: 'Technician', accessor: 'technician' },
    { header: 'Status', render: (row) => (
      <span className={`badge badge-${row.status === 'Resolved' ? 'success' : row.status === 'In Progress' ? 'primary' : row.status === 'Approved' ? 'success' : 'warning'}`}>
        {row.status}
      </span>
    )},
    { header: 'Actions', render: (row) => (
      <div className="action-buttons-group">
        {row.status === 'Pending' && (
          <button className="btn-xs btn-outline" onClick={() => handleStatusUpdate(row.id, 'Approved')}>
            Approve
          </button>
        )}
        {row.status === 'Approved' && (
          <button className="btn-xs btn-primary" onClick={() => handleStatusUpdate(row.id, 'In Progress')}>
            Start Work
          </button>
        )}
        {row.status === 'In Progress' && (
          <button className="btn-xs btn-success" onClick={() => handleStatusUpdate(row.id, 'Resolved')}>
            Resolve
          </button>
        )}
        {row.status === 'Resolved' && (
          <span className="text-muted text-xs">Completed</span>
        )}
      </div>
    )}
  ];

  return (
    <div className="maintenance-page animate-fade-in">
      <div className="page-header flex-between">
        <h1 className="page-title">Maintenance Requests</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiTool /> Raise Request
        </button>
      </div>

      <div className="kpi-grid">
        <Card title="Pending" icon={FiAlertTriangle} value={kpis.pending.toString()} subtitle="Requires Approval" />
        <Card title="Approved" icon={FiCheckCircle} value={kpis.approved.toString()} subtitle="Waiting for technician" />
        <Card title="In Progress" icon={FiActivity} value={kpis.inProgress.toString()} subtitle="Currently in repair" />
        <Card title="Resolved" icon={FiTool} value={kpis.resolved.toString()} subtitle="Completed requests" />
      </div>

      <div className="maintenance-list">
        {loading ? (
          <div className="flex-center" style={{ height: '200px' }}>Loading requests...</div>
        ) : (
          <Table columns={columns} data={requests} search={true} pagination={true} actions={false} />
        )}
      </div>

      {/* Raise Request Dialog Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Raise Maintenance Request</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleRaiseRequest}>
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
                  <label htmlFor="asset">Select Asset</label>
                  <select 
                    id="asset" 
                    className="form-input"
                    value={selectedAssetId}
                    onChange={e => setSelectedAssetId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Asset --</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} - Current: {asset.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority Level</label>
                  <select 
                    id="priority" 
                    className="form-input"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="issue">Issue Description</label>
                  <textarea 
                    id="issue" 
                    className="form-input textarea-input"
                    value={issue}
                    onChange={e => setIssue(e.target.value)}
                    placeholder="Describe the problem in detail..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="technician">Assign Technician (Optional)</label>
                  <input 
                    type="text" 
                    id="technician" 
                    className="form-input"
                    value={technician}
                    onChange={e => setTechnician(e.target.value)}
                    placeholder="e.g. Mike Ross, David Webb"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Raising Request...' : 'Raise Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
