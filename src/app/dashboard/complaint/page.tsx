"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Save,
  FileText,
} from 'lucide-react';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import {
  getUserComplaints,
  registerComplaint,
  updateComplaint,
  deleteComplaint,
  getComplaintDetails,
  UserComplaint,
  ComplaintUpdate,
} from '@/services/complaintApi';
import { getUserProfile } from '@/actions/getUserProfile';
import { IUser } from '@/types';

const ComplaintDashboard = () => {
  const [complaints, setComplaints] = useState<UserComplaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<UserComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [user, setUser] = useState<IUser | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<UserComplaint | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    feature_name: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Feature options for dropdown
  const featureOptions = [
    'AI Resume Analyzer',
    'AI Resume Builder',
    'Job Search',
    'Interview Prep',
    'Quiz Generation',
    'User Profile',
    'Saved Resumes',
    'General',
    'Other',
  ];

  useEffect(() => {
    loadUserAndComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm, statusFilter]);

  const loadUserAndComplaints = async () => {
    try {
      const userProfile = await getUserProfile();
      setUser(userProfile);
      await loadComplaints(userProfile.id);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadComplaints = async (userId: number) => {
    try {
      setLoading(true);
      const userComplaints = await getUserComplaints(userId);
      setComplaints(userComplaints);
    } catch (error) {
      console.error('Error loading complaints:', error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.feature_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((complaint) => complaint.status === statusFilter);
    }

    setFilteredComplaints(filtered);
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.desc || !formData.feature_name) return;

    try {
      setSubmitting(true);
      await registerComplaint(formData);
      await loadComplaints(user!.id);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating complaint:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !formData.title || !formData.desc || !formData.feature_name) return;

    try {
      setSubmitting(true);
      const updateData: ComplaintUpdate = {
        title: formData.title,
        desc: formData.desc,
        feature_name: formData.feature_name,
      };
      await updateComplaint(selectedComplaint.id!, updateData);
      await loadComplaints(user!.id);
      setShowEditModal(false);
      resetForm();
      setSelectedComplaint(null);
    } catch (error) {
      console.error('Error updating complaint:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await deleteComplaint(complaintId);
      await loadComplaints(user!.id);
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  const handleViewComplaint = async (complaint: UserComplaint) => {
    try {
      const details = await getComplaintDetails(complaint.id!);
      setSelectedComplaint(details);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error loading complaint details:', error);
    }
  };

  const handleEditComplaint = (complaint: UserComplaint) => {
    setSelectedComplaint(complaint);
    setFormData({
      title: complaint.title,
      desc: complaint.desc,
      feature_name: complaint.feature_name,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      desc: '',
      feature_name: '',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardNavbar />

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text">
                  Complaint Dashboard
                </h1>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">
                  Manage your complaints and track their resolution status
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors w-full sm:w-auto text-sm sm:text-base font-medium"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>New Complaint</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors text-sm sm:text-base"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors text-sm sm:text-base min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="unsolved">Unsolved</option>
              <option value="in_progress">In Progress</option>
              <option value="solved">Solved</option>
            </select>
          </motion.div>

          {/* Complaints Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No complaints found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first complaint to get started'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredComplaints.map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(complaint.status || 'unsolved')}
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                          complaint.status || 'unsolved'
                        )}`}
                      >
                        {complaint.status || 'unsolved'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleViewComplaint(complaint)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleEditComplaint(complaint)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteComplaint(complaint.id!)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2">{complaint.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-3">{complaint.desc}</p>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-emerald-400 font-medium truncate pr-2">{complaint.feature_name}</span>
                    {complaint.created_at && (
                      <span className="text-gray-500 shrink-0">
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Create New Complaint</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Brief title for your complaint"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Feature</label>
                <select
                  value={formData.feature_name}
                  onChange={(e) => setFormData({ ...formData, feature_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                >
                  <option value="">Select a feature</option>
                  {featureOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  rows={4}
                  placeholder="Detailed description of your complaint"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Complaint</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                  setSelectedComplaint(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateComplaint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Brief title for your complaint"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Feature</label>
                <select
                  value={formData.feature_name}
                  onChange={(e) => setFormData({ ...formData, feature_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                >
                  <option value="">Select a feature</option>
                  {featureOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  rows={4}
                  placeholder="Detailed description of your complaint"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                    setSelectedComplaint(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {submitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Complaint Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedComplaint(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedComplaint.status || 'unsolved')}
                <span
                  className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(
                    selectedComplaint.status || 'unsolved'
                  )}`}
                >
                  {selectedComplaint.status || 'unsolved'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Title</h3>
                <p className="text-gray-300">{selectedComplaint.title}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Feature</h3>
                <p className="text-emerald-400 font-medium">{selectedComplaint.feature_name}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{selectedComplaint.desc}</p>
              </div>

              {selectedComplaint.created_at && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Created At</h3>
                  <p className="text-gray-400">
                    {new Date(selectedComplaint.created_at).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditComplaint(selectedComplaint);
                  }}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedComplaint(null);
                  }}
                  className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDashboard;
