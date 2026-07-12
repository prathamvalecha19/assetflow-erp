import React, { useState, useEffect } from 'react';
import { FiDatabase, FiUsers, FiBox, FiCalendar, FiTool, FiServer } from 'react-icons/fi';

const DatabaseAdmin = () => {
  const [activeTable, setActiveTable] = useState('users');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTableData = async (table) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/" + table);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
      setData([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTableData(activeTable);
  }, [activeTable]);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'monospace' }}>

      {/* Sidebar Navigation */}
      <div style={{ width: '250px', backgroundColor: '#1e293b', padding: '20px', borderRight: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8', marginBottom: '40px', fontSize: '18px', fontWeight: 'bold' }}>
          <FiServer size={24} /> Raw DB Access
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => setActiveTable('users')}
            style={{ textAlign: 'left', padding: '12px', background: activeTable === 'users' ? '#38bdf822' : 'transparent', color: activeTable === 'users' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <FiUsers /> Users Table
          </button>
          <button
            onClick={() => setActiveTable('assets')}
            style={{ textAlign: 'left', padding: '12px', background: activeTable === 'assets' ? '#38bdf822' : 'transparent', color: activeTable === 'assets' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <FiBox /> Assets Table
          </button>
          <button
            onClick={() => setActiveTable('bookings')}
            style={{ textAlign: 'left', padding: '12px', background: activeTable === 'bookings' ? '#38bdf822' : 'transparent', color: activeTable === 'bookings' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <FiCalendar /> Bookings Table
          </button>
          <button
            onClick={() => setActiveTable('maintenance')}
            style={{ textAlign: 'left', padding: '12px', background: activeTable === 'maintenance' ? '#38bdf822' : 'transparent', color: activeTable === 'maintenance' ? '#38bdf8' : '#cbd5e1', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <FiTool /> Maintenance Table
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '30px', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>SELECT * FROM {activeTable};</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ background: '#059669', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>Connection: Local SQLite</span>
            <span style={{ background: '#2563eb', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>Rows: {data.length}</span>
          </div>
        </div>

        {isLoading ? (
          <div style={{ color: '#94a3b8' }}>Executing query...</div>
        ) : (
          <div style={{ background: '#1e293b', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#0f172a' }}>
                <tr>
                  {data.length > 0 && Object.keys(data[0]).map(key => (
                    <th key={key} style={{ padding: '16px', borderBottom: '1px solid #334155', color: '#94a3b8', fontWeight: 'bold' }}>
                      {key.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td style={{ padding: '16px', color: '#94a3b8' }}>0 Results Found.</td></tr>
                ) : (
                  data.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                      {Object.keys(row).map(key => (
                        <td key={key} style={{ padding: '16px', borderBottom: '1px solid #334155', whiteSpace: 'nowrap' }}>
                          {typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key])}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default DatabaseAdmin;
