import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { fetchAssets } from '../services/api';
import { FiPlus, FiFilter } from 'react-icons/fi';
import './Assets.css';

const Assets = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetsData, setAssetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await fetchAssets();
        const formatted = data.map(asset => ({
          id: `AST-${asset.id.toString().padStart(3, '0')}`,
          name: asset.name,
          category: asset.category?.name || 'Uncategorized',
          status: asset.status.charAt(0).toUpperCase() + asset.status.slice(1),
          assignedTo: '-',
          location: '-',
          condition: 'Good'
        }));
        setAssetsData(formatted);
      } catch (err) {
        console.error("Failed to load assets", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAssets();
  }, []);

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
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
      <span className={`badge badge-${getStatusBadge(row.status)}`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="assets-page animate-fade-in">
      <div className="page-header flex-between">
        <h1 className="page-title">Asset Inventory</h1>
        <div className="header-actions">
          <button className="btn btn-outline"><FiFilter /> Filters</button>
          <button className="btn btn-primary"><FiPlus /> Add Asset</button>
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

      {selectedAsset && (
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
                <div className="detail-row"><span>Status:</span> <span className={`badge badge-${getStatusBadge(selectedAsset.status)}`}>{selectedAsset.status}</span></div>
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
