import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMessageSquare,
  FiFolder,
  FiFilter,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

const DesignerDashboard = () => {
  const { user, token } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('consultations');
  const [filters, setFilters] = useState({
    consultationStatus: 'all',
    projectStatus: 'all',
    dateRange: 'all'
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch data with error handling and loading states
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching consultations for designer:', user._id);
      
      const consultationsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/consultations/designer-consultations`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Consultations response:', consultationsRes.data);

      const projectsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects/user/${user._id}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setConsultations(consultationsRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.response || error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch dashboard data';
      setError(errorMessage);
      
      if (error.response?.status === 403) {
        setError('You do not have permission to access this data. Please ensure you are logged in as a designer.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, user._id]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [fetchData, token, refreshKey]);

  // Handle consultation status update
  const handleConsultationStatus = useCallback(async (consultationId, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/consultations/${consultationId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error updating consultation status:', error);
      setError(error.response?.data?.error || 'Failed to update consultation status');
    }
  }, [token]);

  // Filter consultations based on status and date range
  const filteredConsultations = useMemo(() => {
    return consultations.filter(consultation => {
      if (filters.consultationStatus !== 'all' && 
          consultation.status !== filters.consultationStatus) {
        return false;
      }

      if (filters.dateRange !== 'all') {
        const consultationDate = new Date(consultation.date);
        const today = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            return format(consultationDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          case 'week':
            const weekAgo = new Date(today.setDate(today.getDate() - 7));
            return consultationDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
            return consultationDate >= monthAgo;
          default:
            return true;
        }
      }

      return true;
    });
  }, [consultations, filters]);

  // Filter projects based on status
  const filteredProjects = useMemo(() => {
    return projects.filter(project => 
      filters.projectStatus === 'all' || project.status === filters.projectStatus
    );
  }, [projects, filters]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg max-w-lg text-center">
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Designer Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Manage your consultations and projects here.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'consultations'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Consultations ({filteredConsultations.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Projects ({filteredProjects.length})
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <FiFilter className="text-gray-400" />
            <select
              value={activeTab === 'consultations' ? filters.consultationStatus : filters.projectStatus}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                [activeTab === 'consultations' ? 'consultationStatus' : 'projectStatus']: e.target.value
              }))}
              className="px-3 py-2 border rounded-lg bg-white"
            >
              <option value="all">All Status</option>
              {activeTab === 'consultations' ? (
                <>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </>
              )}
            </select>

            {activeTab === 'consultations' && (
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: e.target.value
                }))}
                className="px-3 py-2 border rounded-lg bg-white"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'consultations' ? (
            filteredConsultations.length > 0 ? (
              filteredConsultations.map(consultation => (
                <div
                  key={consultation._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {consultation.projectType} Design Consultation
                      </h2>
                      <div className="flex items-center text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2" />
                          <span>{format(new Date(consultation.date), 'PPP')}</span>
                        </div>
                        <div className="flex items-center">
                          <FiClock className="mr-2" />
                          <span>{consultation.time}</span>
                        </div>
                        <div className="flex items-center">
                          <FiUser className="mr-2" />
                          <span>Client: {consultation.userId.name}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(consultation.status)}`}>
                      {consultation.status}
                    </span>
                  </div>

                  {consultation.message && (
                    <div className="mb-4">
                      <div className="flex items-start text-gray-600">
                        <FiMessageSquare className="mr-2 mt-1" />
                        <p className="line-clamp-2">{consultation.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/consultation/${consultation._id}`}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <span className="mr-1">View Details</span>
                      <FiFolder />
                    </Link>

                    {consultation.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleConsultationStatus(consultation._id, 'confirmed')}
                          className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                        >
                          <FiCheckCircle className="mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleConsultationStatus(consultation._id, 'cancelled')}
                          className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                        >
                          <FiXCircle className="mr-1" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                No consultations found for the selected filters.
              </div>
            )
          ) : (
            // Projects Tab
            filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div
                  key={project._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                      <div className="flex items-center text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <FiUser className="mr-2" />
                          <span>Client: {project.client.name}</span>
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="mr-2" />
                          <span>Started: {format(new Date(project.timeline.startDate), 'PP')}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 line-clamp-2">{project.description}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/project/${project._id}`}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <span className="mr-1">View Project</span>
                      <FiFolder />
                    </Link>

                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        Progress: {project.completionPercentage}%
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${project.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
                No projects found for the selected status.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignerDashboard;
