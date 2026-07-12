import React from 'react';
import './Table.css';
import { FiSearch, FiMoreVertical } from 'react-icons/fi';

const Table = ({ columns, data, search, pagination, actions }) => {
  return (
    <div className="table-container">
      {search && (
        <div className="table-header-controls">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      )}
      
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.header}</th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td>
                      <button className="action-btn">
                        <FiMoreVertical />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="empty-state">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <div className="table-pagination">
          <span>Showing 1 to {data.length} of {data.length} entries</span>
          <div className="pagination-controls">
            <button className="btn-outline btn-sm" disabled>Previous</button>
            <button className="btn-primary btn-sm">1</button>
            <button className="btn-outline btn-sm">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
