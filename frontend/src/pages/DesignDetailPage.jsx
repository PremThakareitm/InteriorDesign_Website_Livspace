import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  FiHome,
  FiDollarSign,
  FiCalendar,
  FiShield,
  FiMaximize2,
  FiList,
  FiPackage,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard
} from 'react-icons/fi';
import PaymentModal from '../components/PaymentModal';

const DesignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchDesignDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/designs/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDesign(response.data);
      } catch (err) {
        console.error('Error fetching design:', err);
        setError('Failed to load design details');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDesignDetails();
    }
  }, [id, token]);

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError('');
      setShowPaymentModal(true);
      setPaymentStatus('processing');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create project after successful payment
      const projectData = {
        title: design.title,
        description: design.description,
        client: user._id,
        designer: design.designer._id,
        designs: [design._id],
        status: 'planning',
        timeline: {
          startDate: new Date(),
          endDate: new Date(Date.now() + (design.timeline || 4) * 7 * 24 * 60 * 60 * 1000)
        },
        budget: {
          total: design.estimatedCost.amount,
          currency: design.estimatedCost.currency || 'INR'
        },
        roomDetails: {
          type: design.roomType?.toLowerCase() === 'living room' ? 'living' : 
                design.roomType?.toLowerCase() === 'bed room' ? 'bedroom' :
                design.roomType?.toLowerCase() === 'bath room' ? 'bathroom' :
                design.roomType?.toLowerCase().includes('kitchen') ? 'kitchen' :
                design.roomType?.toLowerCase().includes('office') ? 'office' : 'living',
          dimensions: {
            width: design.dimensions?.width || 0,
            length: design.dimensions?.length || 0,
            height: design.dimensions?.height || 0,
            unit: design.dimensions?.unit || 'ft'
          }
        },
        materials: design.materials?.map(material => ({
          name: material.name,
          quantity: material.quantity || 1,
          unit: material.unit || 'piece',
          cost: material.estimatedCost || 0,
          status: 'pending'
        })) || []
      };

      const projectResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects`,
        projectData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!projectResponse.data.success) {
        throw new Error(projectResponse.data.error || 'Failed to create project');
      }

      // Show success state
      setPaymentStatus('success');

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to project page
      navigate(`/projects/${projectResponse.data.project._id}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error.response?.data?.error || error.message || 'Failed to process payment');
      setShowPaymentModal(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseModal = () => {
    if (paymentStatus !== 'processing') {
      setShowPaymentModal(false);
      setPaymentStatus('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Design Not Found</h2>
          <p className="text-gray-600">The requested design could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <FiChevronLeft className="w-5 h-5 mr-2" />
          Back to Recommendations
        </button>

        {/* Design Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{design.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{design.description}</p>
        </div>

        {/* Image Gallery */}
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="aspect-[16/9] relative">
            {design.images && design.images[currentImageIndex] && (
              <img
                src={design.images[currentImageIndex].url}
                alt={design.images[currentImageIndex].caption}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1600x900?text=Design+Preview';
                }}
              />
            )}
            
            {/* Image Navigation */}
            {design.images && design.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? design.images.length - 1 : prev - 1))}
                  className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-900 transition-colors"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === design.images.length - 1 ? 0 : prev + 1))}
                  className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-900 transition-colors"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
          
          {/* Image Caption */}
          {design.images && design.images[currentImageIndex] && (
            <div className="p-4 text-center">
              <p className="text-gray-600">{design.images[currentImageIndex].caption}</p>
            </div>
          )}
        </div>

        {/* Design Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Style and Room Type */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center text-gray-900 mb-4">
              <FiHome className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Style & Room</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Style:</span> {design.style}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Room Type:</span> {design.roomType}
              </p>
            </div>
          </div>

          {/* Cost and Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center text-gray-900 mb-4">
              <FiDollarSign className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Cost & Timeline</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Estimated Cost:</span> ₹
                {(design.estimatedCost.amount / 100000).toFixed(1)}L
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Timeline:</span> {design.timeline} weeks
              </p>
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center text-gray-900 mb-4">
              <FiMaximize2 className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Dimensions</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Area:</span> {design.dimensions.area} {design.dimensions.unit}²
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Height:</span> {design.dimensions.height} {design.dimensions.unit}
              </p>
            </div>
          </div>
        </div>

        {/* Features and Materials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Features */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center text-gray-900 mb-4">
              <FiList className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Features</h3>
            </div>
            <ul className="space-y-2">
              {design.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 mt-2 mr-2 bg-luxury-gold rounded-full"></span>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center text-gray-900 mb-4">
              <FiPackage className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Materials</h3>
            </div>
            <div className="space-y-4">
              {design.materials.map((material, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <h4 className="font-medium text-gray-900 mb-1">{material.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{material.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {material.quantity} {material.unit}
                    </span>
                    <span className="text-luxury-gold">
                      ₹{(material.estimatedCost / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Continue Browsing
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className={`px-6 py-3 bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white rounded-lg hover:from-luxury-bronze hover:to-luxury-gold transition-all flex items-center ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <FiCreditCard className="w-5 h-5 mr-2" />
                Book Now
              </>
            )}
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleCloseModal}
        amount={design?.estimatedCost?.amount}
        currency={design?.estimatedCost?.currency || 'INR'}
        title={design?.title}
        status={paymentStatus}
      />
    </div>
  );
};

export default DesignDetailPage;
