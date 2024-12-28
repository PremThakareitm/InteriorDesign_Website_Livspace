import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  FiUser,
  FiCalendar,
  FiTag,
  FiDollarSign,
  FiMaximize2,
  FiLayers,
  FiHeart,
  FiMessageSquare,
  FiEdit3,
  FiTrash2,
  FiArrowLeft,
  FiSave,
  FiX
} from 'react-icons/fi';

const DesignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    style: '',
    roomType: '',
    dimensions: '',
    materials: '',
    estimatedCost: ''
  });
  const [newComment, setNewComment] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchDesign = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/designs/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDesign(response.data);
      setEditForm({
        title: response.data.title,
        description: response.data.description,
        style: response.data.style,
        roomType: response.data.roomType,
        dimensions: response.data.dimensions,
        materials: response.data.materials,
        estimatedCost: response.data.estimatedCost
      });
    } catch (error) {
      console.error('Error fetching design:', error);
      setError(error.response?.data?.error || 'Failed to fetch design details');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchDesign();
  }, [fetchDesign]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/designs/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDesign(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating design:', error);
      setError(error.response?.data?.error || 'Failed to update design');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/designs/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting design:', error);
      setError(error.response?.data?.error || 'Failed to delete design');
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/designs/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDesign(response.data);
    } catch (error) {
      console.error('Error liking design:', error);
      setError(error.response?.data?.error || 'Failed to like design');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/designs/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDesign(response.data);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.response?.data?.error || 'Failed to add comment');
    }
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

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg">
          <h2 className="text-gray-800 font-semibold mb-2">Not Found</h2>
          <p className="text-gray-600">Design not found</p>
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
            <div className="flex justify-between items-start">
              {isEditing ? (
                <form onSubmit={handleEdit} className="w-full">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full text-2xl font-bold mb-2 p-2 border rounded"
                    required
                  />
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      <FiX className="mr-1" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <FiSave className="mr-1" />
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{design.title}</h1>
                  {design.designer._id === user?._id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <FiEdit3 className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Design Information */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Design Details</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Style
                      </label>
                      <input
                        type="text"
                        value={editForm.style}
                        onChange={(e) =>
                          setEditForm({ ...editForm, style: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Type
                      </label>
                      <input
                        type="text"
                        value={editForm.roomType}
                        onChange={(e) =>
                          setEditForm({ ...editForm, roomType: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        value={editForm.dimensions}
                        onChange={(e) =>
                          setEditForm({ ...editForm, dimensions: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FiTag className="mr-3" />
                      <span>Style: {design.style}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiHome className="mr-3" />
                      <span>Room Type: {design.roomType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiMaximize2 className="mr-3" />
                      <span>Dimensions: {design.dimensions}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Materials
                      </label>
                      <textarea
                        value={editForm.materials}
                        onChange={(e) =>
                          setEditForm({ ...editForm, materials: e.target.value })
                        }
                        className="w-full p-2 border rounded h-24"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Cost
                      </label>
                      <input
                        type="number"
                        value={editForm.estimatedCost}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            estimatedCost: e.target.value
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FiLayers className="mr-3" />
                      <span>Materials: {design.materials}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiDollarSign className="mr-3" />
                      <span>Estimated Cost: ${design.estimatedCost}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="mr-3" />
                      <span>
                        Created:{' '}
                        {new Date(design.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            {isEditing ? (
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full p-3 border rounded-lg h-32"
                placeholder="Enter design description..."
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-wrap">
                {design.description}
              </p>
            )}
          </div>

          {/* Images */}
          {design.images && design.images.length > 0 && (
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Design Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {design.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Design ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Likes and Comments */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${
                    design.likes.includes(user?._id)
                      ? 'text-red-600'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <FiHeart
                    className={design.likes.includes(user?._id) ? 'fill-current' : ''}
                  />
                  <span>{design.likes.length}</span>
                </button>
                <div className="flex items-center space-x-1 text-gray-600">
                  <FiMessageSquare />
                  <span>{design.comments.length}</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Comments</h3>
              
              {/* Add Comment Form */}
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={!newComment.trim()}
                  >
                    Comment
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {design.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-gray-50 p-4 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FiUser className="text-gray-600" />
                        <span className="font-medium">
                          {comment.user.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-lg font-semibold mb-4">Delete Design</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this design? This action cannot be
                  undone.
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DesignPage;
