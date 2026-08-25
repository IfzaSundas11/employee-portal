'use client';

import { useEffect, useState } from 'react';

interface AuditLog {
  id: string;
  action: string;
  details: string | null;
  userId?: string | null;
  userName?: string | null;
  entity?: string | null;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters State
  const [userFilter, setUserFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [entityFilter, setEntityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLogs(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching logs:', err);
        setLoading(false);
      });
  }, []);

  // Filter Logic
  const filteredLogs = logs.filter((log) => {
    const matchesUser = userFilter === 'All' || (log.userName && log.userName === userFilter);
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    const matchesEntity = entityFilter === 'All' || (log.entity && log.entity === entityFilter);
    const matchesSearch =
      searchQuery === '' ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUser && matchesAction && matchesEntity && matchesSearch;
  });

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: '#1e293b' }}>
      
      {/* Container Box */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Header */}
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '4px', color: '#0f172a' }}>Audit Logs</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Track and monitor system activities and user actions.</p>

        {/* Filters Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '24px', backgroundColor: '#fafafa', padding: '12px 16px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>User</label>
            <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} style={selectStyle}>
              <option value="All">All</option>
              <option value="Ayesha">Ayesha</option>
              <option value="Nadia">Nadia</option>
              <option value="Ifza">Ifza</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>Action</label>
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} style={selectStyle}>
              <option value="All">All</option>
              <option value="TASK_CREATED">CREATE</option>
              <option value="TASK_UPDATED">UPDATE</option>
              <option value="STATUS_CHANGE">STATUS CHANGE</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>Entity</label>
            <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} style={selectStyle}>
              <option value="All">All</option>
              <option value="Task">Task</option>
              <option value="User">User</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <input
              type="text"
              placeholder="Search details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
            No audit records found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#475569' }}>
                  <th style={thStyle}>Time</th>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Action</th>
                  <th style={thStyle}>Entity</th>
                  <th style={thStyle}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>{new Date(log.createdAt).toLocaleString()}</td>
                    <td style={tdStyle}>{log.userName || 'Ayesha'}</td>
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: getActionColor(log.action) }}>
                      {log.action}
                    </td>
                    <td style={tdStyle}>{log.entity || 'Task'}</td>
                    <td style={{ ...tdStyle, color: '#334155' }}>{log.details || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: '#64748b', fontSize: '13px' }}>
          <div>Showing 1 to {filteredLogs.length} of {logs.length} logs</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button style={pageBtnStyle}>1</button>
            <button style={pageBtnStyle}>2</button>
            <button style={pageBtnStyle}>&gt;</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Styling Constants
const selectStyle = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#ffffff',
  fontSize: '13px',
  outline: 'none',
};

const inputStyle = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  fontSize: '13px',
  outline: 'none',
  width: '180px',
};

const thStyle = {
  padding: '12px 10px',
  fontWeight: 'bold',
  fontSize: '13px',
};

const tdStyle = {
  padding: '14px 10px',
};

const pageBtnStyle = {
  padding: '4px 10px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

function getActionColor(action: string) {
  if (action.includes('CREATE')) return '#059669';
  if (action.includes('UPDATE')) return '#2563eb';
  if (action.includes('DELETE')) return '#dc2626';
  return '#475569';
}