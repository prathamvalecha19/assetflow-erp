import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { fetchAssets, createAsset } from '../services/api';
import { FiPlus, FiFilter } from 'react-icons/fi';
import './Assets.css';

const Assets = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', condition: 'New', location: 'HQ' });
  
  const [assetsData, setAssetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAssets();
      const formatted = data.map(asset => ({
        id: asset.asset_tag || ('AST-' + asset.id.toString().padStart(3, '0')),
        name: asset.name,
        category: asset.category || 'Uncategorized',
        status: (asset.status || 'Available').charAt(0).toUpperCase() + (asset.status || 'Available').slice(1),
        assignedTo: asset.assignedTo || '-',
        location: asset.location || '-',
        condition: asset.condition || 'Good' // Add this
      }));
      setAssetsData(formatted);
    } catch (err) {
      console.error("Failed to load assets", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const getStatusBadge = (status) => {
    switch((status || '').toLowerCase()) {
      case 'available': return 'success';
      case 'allocated': return 'primary';
      case 'reserved': return 'warning';
      case 'maintenance': return 'danger';
      default: return 'neutral';
    }
  };

  const columns = [
    { header: 'Asset Tag', accessor: 'id' },
    { header: 'Asset Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Assigned To', accessor: 'assignedTo' },
    { header: 'Location', accessor: 'location' },
    { header: 'Status', render: (row) => (
      <span className={"badge badge-" + getStatusBadge(row.status)}>
        {row.status}
      </span>
    )}
  ];

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const res = await createAsset(newAsset);
    if (res.success) {
      setIsAddingMode(false);
      setNewAsset({ name: '', condition: 'New', location: 'HQ' });
      loadAssets(); // refresh list
    } else {
      alert("Failed to create asset.");
    }
  };

  return (
    <div className="assets-page animate-fade-in">
      <div className="page-header flex-between">
        <h1 className="page-title">Asset Inventory</h1>
        <div className="header-actions">
          <button className="btn btn-outline"><FiFilter /> Filters</button>
          <button className="btn btn-primary" onClick={() => setIsAddingMode(true)}><FiPlus /> Add Asset</button>
        </div>
      </div>

      <div className="filters-row">
         <select className="filter-select"><option>All Categories</option></select>
         <select className="filter-select"><option>All Statuses</option></select>
         <select className="filter-select"><option>All Locations</option></select>
      </div>

      <div onClick={() => assetsData.length > 0 && setSelectedAsset(assetsData[0])}>
        {isLoading ? (
          <p>Loading assets...</p>
        ) : (
          <Table columns={columns} data={assetsData} search={true} pagination={true} actions={true} />
        )}
      </div>

      {isAddingMode && (
        <div className="modal-overlay" onClick={() => setIsAddingMode(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h2>Register New Asset</h2>
              <button className="close-btn" onClick={() => setIsAddingMode(false)}>×</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body" style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px'}}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Asset Name</label>
                  <input type="text" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Condition</label>
                  <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} value={newAsset.condition} onChange={e => setNewAsset({...newAsset, condition: e.target.value})}>
                    <option>New</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Poor</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Location</label>
                  <input type="text" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} value={newAsset.location} onChange={e => setNewAsset({...newAsset, location: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer" style={{ marginTop: '20px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsAddingMode(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ marginLeft: '10px' }}>Create Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAsset && !isAddingMode && (
        <div className="modal-overlay" onClick={() => setSelectedAsset(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header flex-between">
              <h2>Asset Details</h2>
              <button className="close-btn" onClick={() => setSelectedAsset(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="asset-detail-card">
                <div className="detail-row"><span>Name:</span> {selectedAsset.name}</div>
                <div className="detail-row"><span>Tag:</span> {selectedAsset.id}</div>
                <div className="detail-row"><span>Status:</span> <span className={"badge badge-" + getStatusBadge(selectedAsset.status)}>{selectedAsset.status}</span></div>
                <div className="detail-row"><span>Condition:</span> {selectedAsset.condition}</div>
                <div className="detail-row"><span>Location:</span> {selectedAsset.location}</div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedAsset(null)}>Close</button>
              <button className="btn btn-primary">Edit Asset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
