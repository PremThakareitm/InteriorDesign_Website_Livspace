import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiHome, FiEdit, FiTrello, FiClock, FiCheckCircle, FiXCircle, FiRefreshCw, FiMessageSquare, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          setProjects(response.data.projects);
        } else {
          setError('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const dashboardItems = [
    {
      title: 'Room Visualizer',
      description: 'Design and visualize your dream space in 3D',
      icon: <FiHome className="w-6 h-6" />,
      link: '/visualizer',
      stats: 'Create unlimited designs',
      bgColor: 'from-luxury-gold/20 to-luxury-bronze/20',
      progress: 80,
    },
    {
      title: 'Portfolio',
      description: 'View and manage your saved designs',
      icon: <FiTrello className="w-6 h-6" />,
      link: '/portfolio',
      stats: 'Access all projects',
      bgColor: 'from-luxury-gold/10 to-luxury-bronze/10',
      progress: 65,
    },
    {
      title: 'Consultation',
      description: 'Schedule a consultation with our design experts',
      icon: <FiCalendar className="w-6 h-6" />,
      link: '/consultation',
      stats: 'Book appointments',
      bgColor: 'from-luxury-gold/15 to-luxury-bronze/15',
      progress: 45,
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'planning':
        return 'text-blue-500';
      case 'in-progress':
        return 'text-yellow-500';
      case 'review':
        return 'text-purple-500';
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const formatDate = (date) => {
    const now = new Date();
    const projectDate = new Date(date);
    const diffInHours = Math.floor((now - projectDate) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      if (diffInHours === 0) return 'Just now';
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    if (diffInHours < 48) return 'Yesterday';
    return format(projectDate, 'MMM d, yyyy');
  };

  const RecentProjects = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 py-4">
          {error}
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div className="text-center text-gray-500 py-4">
          No projects found. Start by booking a design consultation!
        </div>
      );
    }

    return projects.slice(0, 3).map((project, index) => (
      <motion.div
        key={project._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow"
      >
        <div className="flex">
          <div className="w-1/3">
            <img
              src={project.designs[0]?.images[0]?.url || 'https://via.placeholder.com/300x200'}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="w-2/3 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{project.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <FiUser className="mr-2" />
                {project.designer?.name || 'Unassigned'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiDollarSign className="mr-2" />
                ₹{(project.budget?.total || 0).toLocaleString('en-IN')}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiHome className="mr-2" />
                {project.roomDetails?.dimensions?.area || 'N/A'} sq.ft
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="mr-2" />
                {formatDate(project.timeline?.startDate)}
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-luxury-gold">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-luxury-gold">
                    {project.progress || 0}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${project.progress || 0}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor(project.progress || 0)}`}
                ></div>
              </div>
            </div>
            <Link
              to={`/projects/${project._id}`}
              className="inline-flex items-center text-luxury-gold hover:text-luxury-bronze transition-colors"
            >
              View Details <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </motion.div>
    ));
  };

  const UpcomingConsultations = () => {
    const { token } = useAuth();
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
      const fetchConsultations = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/consultations/upcoming`,
            {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          let sortedConsultations = [...response.data];
          sortedConsultations.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          });

          setConsultations(sortedConsultations);
        } catch (error) {
          console.error('Error fetching consultations:', error);
          setError(error.response?.data?.error || 'Failed to fetch consultations');
        } finally {
          setLoading(false);
        }
      };

      if (token) {
        fetchConsultations();
      }
    }, [token, sortOrder]);

    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'bg-luxury-gold/20 text-luxury-gold border-luxury-gold/30';
        case 'confirmed':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'completed':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'cancelled':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getStatusIcon = (status) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return <FiClock className="w-4 h-4" />;
        case 'confirmed':
          return <FiCheckCircle className="w-4 h-4" />;
        case 'completed':
          return <FiCheckCircle className="w-4 h-4" />;
        case 'cancelled':
          return <FiXCircle className="w-4 h-4" />;
        default:
          return <FiClock className="w-4 h-4" />;
      }
    };

    if (loading) {
      return (
        <div className="bg-black/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 h-96">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-luxury-gold/20 rounded w-1/3"></div>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-luxury-gold/10 rounded-full flex-1"></div>
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-luxury-gold/10 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-black/5 backdrop-blur-lg rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center text-gray-900">
            <FiCalendar className="mr-2 text-luxury-gold" />
            Upcoming Consultations
          </h3>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-xl bg-black/5 border border-luxury-gold/10 hover:bg-luxury-gold/5 transition-colors"
          >
            <FiRefreshCw className={`w-5 h-5 text-luxury-gold transform ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
          </button>
        </div>

        <div className="space-y-4">
          {consultations.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="w-8 h-8 text-luxury-gold" />
              </div>
              <p className="text-gray-500 mb-4">No upcoming consultations</p>
              <Link
                to="/consultation"
                className="inline-block px-6 py-3 bg-luxury-gold text-white rounded-xl hover:bg-luxury-gold/90 transition-colors"
              >
                Book Consultation
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {consultations.map((consultation) => (
                <Link
                  key={consultation._id}
                  to={`/consultation/${consultation._id}`}
                  className="block group"
                >
                  <div className="bg-black/5 backdrop-blur-lg rounded-xl p-6 hover:bg-luxury-gold/5 transition-all border border-luxury-gold/10">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 group-hover:text-luxury-gold transition-colors">
                            {consultation.projectType}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-sm border flex items-center gap-1 ${getStatusColor(consultation.status)}`}>
                            {getStatusIcon(consultation.status)}
                            {consultation.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiCalendar className="w-4 h-4 text-luxury-gold" />
                            {format(new Date(consultation.date), 'EEE, MMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiClock className="w-4 h-4 text-luxury-gold" />
                            {consultation.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiUser className="w-4 h-4 text-luxury-gold" />
                            {consultation.designer?.name || 'Assigning Designer...'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiHome className="w-4 h-4 text-luxury-gold" />
                            {consultation.propertyType}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center group-hover:bg-luxury-gold/20 transition-colors">
                          <FiMessageSquare className="w-6 h-6 text-luxury-gold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's what's happening with your interior design projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${item.bgColor} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
          >
            <Link to={item.link} className="block">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-800">{item.icon}</div>
                <div className="text-sm text-gray-600">{item.stats}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${item.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-luxury-gold"
                  ></div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Recent Projects</h2>
              <Link
                to="/projects"
                className="text-luxury-gold hover:text-luxury-bronze transition-colors flex items-center"
              >
                View All <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <RecentProjects />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Upcoming Consultations</h2>
              <Link
                to="/consultation"
                className="text-luxury-gold hover:text-luxury-bronze transition-colors flex items-center"
              >
                View All <FiArrowRight className="ml-2" />
              </Link>
            </div>
            <UpcomingConsultations />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
