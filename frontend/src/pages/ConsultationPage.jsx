import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiMessageSquare, FiHome, FiCheck } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ConsultationPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    projectType: '',
    propertyType: '',
    budget: '',
    date: new Date(new Date().setDate(new Date().getDate() + 1)), // Set default to tomorrow
    time: '',
    message: ''
  });

  // Get tomorrow's date for minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    // Ensure the time is preserved when changing date
    const newDate = new Date(date);
    if (formData.time) {
      const [hours, minutes] = formData.time.split(':');
      newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
  };

  const handleTimeChange = (e) => {
    const { value } = e.target;
    const [hours, minutes] = value.split(':');
    const newDate = new Date(formData.date);
    newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    setFormData(prev => ({
      ...prev,
      time: value,
      date: newDate
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user || !token) {
        throw new Error('Please log in to book a consultation');
      }

      // Validate date and time
      const consultationDateTime = new Date(formData.date);
      const now = new Date();
      if (consultationDateTime <= now) {
        throw new Error('Please select a future date and time for the consultation');
      }

      if (!formData.time) {
        throw new Error('Please select a time slot for the consultation');
      }

      // Format time to 12-hour format with AM/PM
      const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${String(formattedHour).padStart(2, '0')}:${minutes} ${ampm}`;
      };

      // Create consultation data
      const consultationData = {
        userId: user._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType,
        propertyType: formData.propertyType,
        budget: formData.budget,
        date: consultationDateTime.toISOString(),
        time: formatTime(formData.time),
        message: formData.message
      };

      // Submit consultation
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/consultations/new`,
        consultationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && !response.data.error) {
        setIsSubmitted(true);
        setCurrentStep(4);
        // Navigate to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(response.data.error || 'Failed to book consultation');
      }
    } catch (error) {
      console.error('Error booking consultation:', error);
      setError(error.response?.data?.error || error.message || 'Failed to book consultation');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const projectTypes = [
    { id: 'full', label: 'Full Home Design', icon: '🏠' },
    { id: 'room', label: 'Single Room', icon: '🛋️' },
    { id: 'kitchen', label: 'Kitchen Remodel', icon: '🍳' },
    { id: 'bathroom', label: 'Bathroom Remodel', icon: '🚿' },
    { id: 'outdoor', label: 'Outdoor Space', icon: '🌿' },
    { id: 'office', label: 'Office Design', icon: '💼' },
  ];

  const propertyTypes = [
    'Apartment',
    'House',
    'Villa',
    'Studio',
    'Penthouse',
    'Commercial Space',
  ];

  const budgetRanges = [
    '₹5L - ₹10L',
    '₹10L - ₹25L',
    '₹25L - ₹50L',
    '₹50L - ₹1Cr',
    'Above ₹1Cr',
  ];

  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00'
  ];

  const formatDisplayTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${String(formattedHour).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-8">What type of project are you planning?</h2>
            <div className="grid grid-cols-2 gap-4">
              {projectTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, projectType: type.id }));
                    setCurrentStep(2);
                  }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.projectType === type.id
                      ? 'border-luxury-gold bg-luxury-gold/5'
                      : 'border-gray-200 hover:border-luxury-gold/50'
                  }`}
                >
                  <span className="text-3xl mb-3 block">{type.icon}</span>
                  <span className="font-medium">{type.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-8">Tell us about your property</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-luxury-gold outline-none transition-colors"
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-luxury-gold outline-none transition-colors"
                >
                  <option value="">Select Budget Range</option>
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(3)}
                disabled={!formData.propertyType || !formData.budget}
                className="w-full py-4 bg-luxury-gold text-white rounded-xl font-medium hover:bg-luxury-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-8">Schedule Your Consultation</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    minDate={tomorrow}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-luxury-gold outline-none transition-colors"
                    placeholderText="Select Date"
                    dateFormat="MMMM d, yyyy"
                    wrapperClassName="w-full"
                  />
                  <FiCalendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <motion.button
                      key={slot}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTimeChange({ target: { value: slot } })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.time === slot
                          ? 'border-luxury-gold bg-luxury-gold/5'
                          : 'border-gray-200 hover:border-luxury-gold/50'
                      }`}
                    >
                      {formatDisplayTime(slot)}
                    </motion.button>
                  ))}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(4)}
                disabled={!formData.date || !formData.time}
                className="w-full py-4 bg-luxury-gold text-white rounded-xl font-medium hover:bg-luxury-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-8">Your Contact Information</h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-luxury-gold outline-none transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-luxury-gold outline-none transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-luxury-gold outline-none transition-colors"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-luxury-gold outline-none transition-colors resize-none"
                  placeholder="Tell us more about your project..."
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-luxury-gold text-white rounded-xl font-medium hover:bg-luxury-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Scheduling...' : 'Schedule Consultation'}
              </motion.button>
            </form>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Consultation Scheduled!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for choosing Luxury Interiors. We'll send you a confirmation email with all the details.
          </p>
          <Link
            to="/"
            className="inline-block py-4 px-8 bg-luxury-gold text-white rounded-xl font-medium hover:bg-luxury-gold-hover transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-luxury-gold to-luxury-bronze bg-clip-text text-transparent">
              Book Your Consultation
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-1.5xl mx-auto">
            Schedule a personalized consultation with our expert designers to bring your vision to life
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          {/* Navigation Header */}
          <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg shadow-sm z-50 border-b border-gray-100">
            <div className="max-w-screen-2xl mx-auto px-8">
              <div className="flex justify-between items-center h-16">
                <Link to="/" className="flex items-center space-x-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-luxury-gold to-luxury-gold-hover bg-clip-text text-transparent">
                    Luxury
                  </span>
                  <span className="text-2xl font-light text-gray-800">Interiors</span>
                </Link>
                <div className="hidden md:flex items-center space-x-10">
                  <Link to="/" className="nav-link hover:text-luxury-gold transition-colors">
                    Home
                  </Link>
                  <Link to="/portfolio" className="nav-link hover:text-luxury-gold transition-colors">
                    Portfolio
                  </Link>
                  <Link to="/visualizer" className="nav-link hover:text-luxury-gold transition-colors">
                    3D Visualizer
                  </Link>
                  <Link to="/ideas" className="nav-link hover:text-luxury-gold transition-colors">
                    Get Ideas
                  </Link>
                  <Link
                    to="/consultation"
                    className="nav-link text-luxury-gold font-medium"
                  >
                    Consultation
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <div className="pt-16 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-8">
                {/* Progress Steps */}
                <div className="mb-12">
                  <div className="flex justify-between items-center">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className="flex items-center"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step <= currentStep
                              ? 'bg-luxury-gold text-white'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {step}
                        </div>
                        {step < 4 && (
                          <div
                            className={`w-24 h-1 ${
                              step < currentStep ? 'bg-luxury-gold' : 'bg-gray-100'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">Project Type</span>
                    <span className="text-sm text-gray-500">Property Details</span>
                    <span className="text-sm text-gray-500">Schedule</span>
                    <span className="text-sm text-gray-500">Contact Info</span>
                  </div>
                </div>

                {/* Form Steps */}
                <AnimatePresence mode="wait">
                  {renderStep()}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;
