import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiMessageSquare, FiClock, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = ({ project, onStatusUpdate, onFeedbackSubmit }) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const isDesigner = user?._id === project.designer._id;

  const handleStatusUpdate = (newStatus) => {
    onStatusUpdate(project._id, newStatus, statusNote);
    setStatusNote('');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    onFeedbackSubmit(project._id, feedback);
    setFeedback('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{project.title}</h2>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          {project.status}
        </span>
      </div>

      {/* Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
        <div className="space-y-4">
          {project.timeline.map((event, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-4"></div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{event.status}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(event.date), 'PPp')}
                  </span>
                </div>
                {event.note && (
                  <p className="text-gray-600 text-sm mt-1">{event.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Update (Designer Only) */}
      {isDesigner && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Update Status</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Add a note about this status update"
              />
            </div>
            <div className="flex gap-2">
              {['in-progress', 'review', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Feedback</h3>
        <div className="space-y-4 mb-4">
          {project.feedback.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                item.from === 'designer' ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {item.from === 'designer' ? 'Designer' : 'Client'}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(item.date), 'PPp')}
                </span>
              </div>
              <p className="text-gray-600">{item.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              placeholder="Enter your feedback..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={!feedback.trim()}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectDetails;
