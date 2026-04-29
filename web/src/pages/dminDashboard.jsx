// web/src/pages/AdminDashboard.jsx (simplified but complete)
import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

ChartJS.register();

export default function AdminDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchUsers();
    fetchAuditLogs();
    fetchStats();
  }, [statusFilter]);

  const fetchReports = async () => {
    const url = statusFilter ? `/reports?status=${statusFilter}` : '/reports';
    const res = await api.get(url);
    setReports(res.data);
  };
  const fetchUsers = async () => { const res = await api.get('/users'); setUsersList(res.data); };
  const fetchAuditLogs = async () => { const res = await api.get('/audit'); setAuditLogs(res.data); };
  const fetchStats = async () => { const res = await api.get('/stats/admin'); setStats(res.data); };

  const updateReportStatus = async (id, newStatus) => {
    await api.put(`/reports/${id}`, { status: newStatus });
    fetchReports();
  };

  const statCards = [
    { label: 'All Cases', value: stats.total, status: null, color: 'blue' },
    { label: 'Pending', value: stats.pending, status: 'pending', color: 'yellow' },
    { label: 'Assigned', value: stats.assigned, status: 'assigned', color: 'indigo' },
    { label: 'Dispatched', value: stats.dispatched, status: 'dispatched', color: 'purple' },
    { label: 'Investigating', value: stats.investigating, status: 'investigating', color: 'orange' },
    { label: 'In Court', value: stats.inCourt, status: 'in_court', color: 'indigo' },
    { label: 'Remanded', value: stats.remanded, status: 'victim_remanded', color: 'red' },
    { label: 'Convicted', value: stats.convicted, status: 'victim_convicted_imprison', color: 'gray' },
    { label: 'Resolved', value: stats.resolved, status: 'resolved', color: 'green' }
  ];

  // Chart data from stats.districtData etc.
  const districtChart = { labels: stats.districtData?.map(d => d.district), datasets: [{ label: 'Cases', data: stats.districtData?.map(d => d.count), backgroundColor: '#3b82f6' }] };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">SCOEN Admin Dashboard</h1>
      <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-6">
        {statCards.map(card => (
          <div key={card.label} className={`bg-${card.color}-100 p-2 rounded shadow text-center cursor-pointer hover:bg-${card.color}-200`} onClick={() => setStatusFilter(card.status)}>
            <div className={`text-2xl font-bold text-${card.color}-600`}>{card.value}</div>
            <div className="text-xs">{card.label}</div>
          </div>
        ))}
      </div>
      {statusFilter && <button className="mb-4 bg-gray-500 text-white px-3 py-1 rounded" onClick={() => setStatusFilter(null)}>Clear Filter (showing {statusFilter})</button>}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-3 rounded shadow"><Bar data={districtChart} /></div>
        {/* Repeat for village, parish, policeStation charts */}
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr><th>ID</th><th>Type</th><th>Location</th><th>Victim Name</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td className="border px-2">{r.id}</td>
                <td className="border px-2">{r.displayType}</td>
                <td className="border px-2">{r.village}, {r.district}</td>
                <td className="border px-2">{r.victimName}</td>
                <td className="border px-2">{r.status}</td>
                <td className="border px-2">
                  <button className="bg-blue-500 text-white px-2 py-0.5 rounded" onClick={() => alert('View details modal')}>View</button>
                  <button className="bg-green-500 text-white px-2 py-0.5 rounded ml-1" onClick={() => updateReportStatus(r.id, 'resolved')}>Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* User Management and Audit Trail tables similar */}
    </div>
  );
}