import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiHome,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiSave,
  FiArrowLeft
} from 'react-icons/fi';

const DashboardConsultationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState(null);

  const fetchConsultation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/consultations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConsultation(response.data);
      setEditedNotes(response.data.designerNotes || '');
    } catch (error) {
      console.error('Error fetching consultation:', error);
      setError(error.response?.data?.error || 'Failed to fetch consultation details');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  const handleStatusUpdate = async (status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/consultations/${id}/status`,
        { 
          status,
          updatedBy: user._id,
          updateMessage: status === 'confirmed' ? 
            'Your consultation request has been accepted!' : 
            'Your consultation request has been declined.'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchConsultation();
      setShowConfirmation(false);
      
      // Create notification for the client
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        {
          userId: consultation.userId._id,
          type: 'consultation_status_update',
          title: `Consultation ${status === 'confirmed' ? 'Accepted' : 'Declined'}`,
          message: status === 'confirmed' ? 
            'Your consultation request has been accepted! The designer will contact you soon.' : 
            'Your consultation request has been declined. Please contact support for more information.',
          consultationId: id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleNotesUpdate = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/consultations/${id}/notes`,
        { notes: editedNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      await fetchConsultation();
    } catch (error) {
      console.error('Error updating notes:', error);
      setError(error.response?.data?.error || 'Failed to update notes');
    }
  };

  const handleCreateProject = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects`,
        {
          consultationId: id,
          title: `${consultation.projectType} Design Project`,
          description: consultation.message
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/project/${response.data._id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.response?.data?.error || 'Failed to create project');
    }
  };

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-red-50 p-6 rounded-lg">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center text-red-800 hover:text-red-900"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg">
          <h2 className="text-gray-800 font-semibold mb-2">Not Found</h2>
          <p className="text-gray-600">Consultation not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {consultation.projectType} Design Consultation
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(consultation.status)}`}>
                  {consultation.status}
                </span>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FiArrowLeft size={24} />
              </button>
            </div>
          </div>

          {/* Client Information */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <FiUser className="mr-3" />
                <span>{consultation.userId.name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiMail className="mr-3" />
                <span>{consultation.userId.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiPhone className="mr-3" />
                <span>{consultation.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiHome className="mr-3" />
                <span>{consultation.propertyType}</span>
              </div>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Consultation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-3" />
                <span>{format(new Date(consultation.date), 'PPP')}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiClock className="mr-3" />
                <span>{consultation.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiDollarSign className="mr-3" />
                <span>Budget: ${consultation.budget}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          {consultation.message && (
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Client Message</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start text-gray-600">
                  <FiMessageSquare className="mr-3 mt-1" />
                  <p className="whitespace-pre-wrap">{consultation.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Designer Notes */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Designer Notes</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <FiEdit3 className="mr-1" />
                  Edit Notes
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add your notes here..."
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNotesUpdate}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FiSave className="mr-2" />
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 whitespace-pre-wrap">
                  {consultation.designerNotes || 'No notes added yet.'}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {consultation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setActionType('confirm');
                        setShowConfirmation(true);
                      }}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <FiCheckCircle className="mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        setActionType('cancel');
                        setShowConfirmation(true);
                      }}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <FiXCircle className="mr-2" />
                      Decline
                    </button>
                  </>
                )}
              </div>
              {consultation.status === 'confirmed' && (
                <button
                  onClick={handleCreateProject}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FiEdit3 className="mr-2" />
                  Create Project
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">
                {actionType === 'confirm'
                  ? 'Accept Consultation'
                  : 'Decline Consultation'}
              </h3>
              <p className="text-gray-600 mb-6">
                {actionType === 'confirm'
                  ? 'Are you sure you want to accept this consultation?'
                  : 'Are you sure you want to decline this consultation?'}
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(actionType === 'confirm' ? 'confirmed' : 'cancelled')
                  }
                  className={`px-4 py-2 text-white rounded-md ${
                    actionType === 'confirm'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionType === 'confirm' ? 'Accept' : 'Decline'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardConsultationPage;
