import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiRefreshCw,
  FiBell,
  FiDollarSign,
  FiHome
} from 'react-icons/fi';

const SupplierPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [action, setAction] = useState(null);

  // Check authentication and role
  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role !== 'supplier') {
    navigate('/dashboard');
    return null;
  }

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/consultations/all`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setConsultations(response.data);
      }
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError('Failed to fetch consultations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchConsultations();
    }
  }, [token]);

  const handleStatusUpdate = async (consultationId, newStatus) => {
    try {
      setError('');
      
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/consultations/${consultationId}/status`,
        {
          status: newStatus,
          updatedBy: user._id,
          updateMessage: newStatus === 'confirmed' 
            ? 'Your consultation request has been accepted!'
            : 'Your consultation request has been declined.'
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/notifications`,
          {
            recipientId: selectedConsultation.userId,
            type: 'consultation_update',
            message: newStatus === 'confirmed'
              ? 'Your consultation request has been accepted!'
              : 'Your consultation request has been declined.',
            consultationId: consultationId
          },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        await fetchConsultations();
        setShowConfirmation(false);
        setSelectedConsultation(null);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update consultation status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Consultations</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="declined">Declined</option>
            </select>
            <button
              onClick={fetchConsultations}
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Refresh"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {consultations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <FiCalendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Consultations Found</h3>
              <p className="text-gray-500">There are no consultations available at the moment.</p>
            </div>
          ) : (
            consultations
              .filter(consultation => filter === 'all' || consultation.status === filter)
              .map((consultation) => (
                <div
                  key={consultation._id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {consultation.propertyType} Consultation
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-500">
                            <FiUser className="w-4 h-4 mr-2" />
                            <span>{consultation.userName}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <FiCalendar className="w-4 h-4 mr-2" />
                            <span>{format(new Date(consultation.date), 'PPP')}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <FiClock className="w-4 h-4 mr-2" />
                            <span>{consultation.time}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <FiHome className="w-4 h-4 mr-2" />
                            <span>{consultation.propertySize} sq ft</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <FiDollarSign className="w-4 h-4 mr-2" />
                            <span>Budget: ${consultation.budget}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          consultation.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : consultation.status === 'declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                      </span>
                    </div>

                    {consultation.status === 'pending' && (
                      <div className="mt-6 flex justify-end gap-4">
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setAction('confirm');
                            setShowConfirmation(true);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setAction('decline');
                            setShowConfirmation(true);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                        >
                          <FiXCircle className="w-4 h-4 mr-2" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {action === 'confirm' ? 'Accept Consultation?' : 'Decline Consultation?'}
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to {action === 'confirm' ? 'accept' : 'decline'} this consultation?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(
                  selectedConsultation._id,
                  action === 'confirm' ? 'confirmed' : 'declined'
                )}
                className={`px-4 py-2 text-white rounded-lg ${
                  action === 'confirm'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {action === 'confirm' ? 'Accept' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPage;
