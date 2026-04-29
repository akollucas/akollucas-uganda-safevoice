import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [statusFilter]);

  const fetchReports = async () => {
    const url = statusFilter ? `/reports?status=${statusFilter}` : '/reports';
    const res = await api.get(url);
    setReports(res.data);
  };

  const fetchStats = async () => {
    const res = await api.get('/stats/admin');
    setStats(res.data);
  };

  // ... render stat cards with onClick={() => setStatusFilter(statType)} and "Clear Filter" button
}