import React, { useState, useEffect } from 'react';
import { User, Complaint, CATEGORIES } from '../types';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  TrendingUp,
  Users,
  ClipboardList,
  MapPin,
  Calendar
} from 'lucide-react';
import { cn, getStatusColor } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard({ user }: { user: User }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: '',
  });
  const [updateData, setUpdateData] = useState({
    status: '',
    remarks: '',
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    const query = new URLSearchParams(filters).toString();
    const [complaintsRes, statsRes] = await Promise.all([
      fetch(`/api/admin/complaints?${query}`),
      fetch('/api/admin/stats')
    ]);
    const complaintsData = await complaintsRes.json();
    const statsData = await statsRes.json();
    setComplaints(complaintsData);
    setStats(statsData);
    setLoading(false);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    const res = await fetch(`/api/admin/complaints/${selectedComplaint.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      setSelectedComplaint(null);
      fetchData();
    }
  };

  const categoryChartData = {
    labels: stats?.categoryStats.map((s: any) => s.category) || [],
    datasets: [{
      label: 'Complaints by Category',
      data: stats?.categoryStats.map((s: any) => s.count) || [],
      backgroundColor: [
        'rgba(16, 185, 129, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(245, 158, 11, 0.6)',
        'rgba(239, 68, 68, 0.6)',
        'rgba(139, 92, 246, 0.6)',
        'rgba(107, 114, 128, 0.6)',
      ],
      borderRadius: 8,
    }]
  };

  const statusChartData = {
    labels: stats?.statusStats.map((s: any) => s.status) || [],
    datasets: [{
      data: stats?.statusStats.map((s: any) => s.count) || [],
      backgroundColor: [
        'rgba(245, 158, 11, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(16, 185, 129, 0.6)',
      ],
      borderWidth: 0,
    }]
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Monitor and manage municipal complaints</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total', value: stats?.summary.total, icon: <TrendingUp />, color: 'text-slate-600', bg: 'bg-slate-100' },
          { label: 'Pending', value: stats?.summary.pending, icon: <Clock />, color: 'text-yellow-600', bg: 'bg-yellow-100' },
          { label: 'In Progress', value: stats?.summary.inProgress, icon: <AlertCircle />, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Resolved', value: stats?.summary.resolved, icon: <CheckCircle2 />, color: 'text-green-600', bg: 'bg-green-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stat.value || 0}</div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">Category Distribution</h2>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            {stats ? <Bar data={categoryChartData} options={{ maintainAspectRatio: false }} /> : 'Loading...'}
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">Status Overview</h2>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            {stats ? <Pie data={statusChartData} options={{ maintainAspectRatio: false }} /> : 'Loading...'}
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID or Title..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filters.category}
                onChange={e => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none min-w-[160px]"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none min-w-[160px]"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-sm font-bold text-slate-600">ID</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600">Citizen</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600">Complaint</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600">Status</th>
                <th className="px-8 py-5 text-sm font-bold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-mono font-bold text-emerald-600">{complaint.complaint_id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-800">{complaint.citizen_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-800">{complaint.title}</div>
                    <div className="text-xs text-slate-500">{complaint.category}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold border", getStatusColor(complaint.status))}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setUpdateData({ status: complaint.status, remarks: complaint.remarks || '' });
                      }}
                      className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Complaint Details</h2>
                    <p className="text-sm text-slate-500 font-mono">{selectedComplaint.complaint_id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title</label>
                    <p className="text-lg font-bold text-slate-800">{selectedComplaint.title}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                    <p className="text-slate-600 leading-relaxed">{selectedComplaint.description}</p>
                  </div>
                  <div className="flex gap-8">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">{selectedComplaint.location}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted On</label>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">{new Date(selectedComplaint.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {selectedComplaint.image_path && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evidence Image</label>
                      <img
                        src={selectedComplaint.image_path}
                        alt="Complaint Evidence"
                        className="w-full rounded-2xl border border-slate-100 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-8 rounded-3xl space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    Action & Remarks
                  </h3>
                  <form onSubmit={handleUpdateStatus} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Update Status</label>
                      <select
                        value={updateData.status}
                        onChange={e => setUpdateData({ ...updateData, status: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Admin Remarks</label>
                      <textarea
                        rows={4}
                        value={updateData.remarks}
                        onChange={e => setUpdateData({ ...updateData, remarks: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                        placeholder="Enter update notes or resolution details..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Update Complaint
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
