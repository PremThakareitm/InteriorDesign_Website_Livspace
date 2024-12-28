import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiHome, FiDollarSign, FiLayout, FiSearch, FiEye } from 'react-icons/fi';

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [preferences, setPreferences] = useState({
    style: '',
    budget: '',
    roomType: ''
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const styles = [
    { id: 'modern', name: 'Modern', description: 'Clean lines and contemporary aesthetics' },
    { id: 'contemporary', name: 'Contemporary', description: 'Current trends and modern comfort' },
    { id: 'traditional', name: 'Traditional', description: 'Classic Indian heritage' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple and elegant' },
    { id: 'industrial', name: 'Industrial', description: 'Raw and urban aesthetics' },
    { id: 'indo-modern', name: 'Indo-Modern', description: 'Perfect blend of modern and traditional' }
  ];

  const budgetRanges = [
    { id: 'budget', name: '₹3L - ₹8L', description: 'Budget-friendly designs' },
    { id: 'mid', name: '₹8L - ₹15L', description: 'Mid-range luxury' },
    { id: 'premium', name: '₹15L - ₹30L', description: 'Premium finishes' },
    { id: 'luxury', name: '₹30L+', description: 'Ultimate luxury' }
  ];

  const roomTypes = [
    { id: 'living', name: 'Living Room', description: 'Family and entertainment space' },
    { id: 'bedroom', name: 'Bedroom', description: 'Comfortable sleeping space' },
    { id: 'kitchen', name: 'Kitchen', description: 'Modern cooking area' },
    { id: 'bathroom', name: 'Bathroom', description: 'Luxurious bath space' },
    { id: 'office', name: 'Home Office', description: 'Professional workspace' },
    { id: 'pooja', name: 'Pooja Room', description: 'Sacred prayer space' },
    { id: 'dining', name: 'Dining Room', description: 'Family dining area' }
  ];

  useEffect(() => {
    fetchRecommendations();
  }, [preferences]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError('');

      const params = Object.fromEntries(
        Object.entries(preferences).filter(([_, v]) => v !== '')
      );

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/designs`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      setRecommendations(response.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setPreferences({
      style: '',
      budget: '',
      roomType: ''
    });
  };

  const handleViewDetails = (designId) => {
    navigate(`/design/${designId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-luxury-gold to-luxury-bronze bg-clip-text text-transparent">
              Discover Your Dream Space
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-1.5xl mx-auto">
            Explore our curated collection of design templates, customizable for any location across India
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Customize Your Search</h2>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
          
          {/* Style Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Design Style</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setPreferences(prev => ({ ...prev, style: style.id }))}
                  className={`p-4 rounded-lg text-left transition-all ${
                    preferences.style === style.id
                      ? 'bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium mb-1">{style.name}</div>
                  <div className="text-sm opacity-80">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {budgetRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setPreferences(prev => ({ ...prev, budget: range.id }))}
                  className={`p-4 rounded-lg text-left transition-all ${
                    preferences.budget === range.id
                      ? 'bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium mb-1">{range.name}</div>
                  <div className="text-sm opacity-80">{range.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Room Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Room Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {roomTypes.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setPreferences(prev => ({ ...prev, roomType: room.id }))}
                  className={`p-4 rounded-lg text-left transition-all ${
                    preferences.roomType === room.id
                      ? 'bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="font-medium mb-1">{room.name}</div>
                  <div className="text-sm opacity-80">{room.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((design) => (
            <motion.div
              key={design._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleViewDetails(design._id)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {design.images && design.images[0] && (
                  <img
                    src={design.images[0].url}
                    alt={design.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600?text=Design+Preview';
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-semibold mb-2">{design.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                      {design.style}
                    </span>
                    <span className="px-2 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                      {design.roomType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-600 mb-4 line-clamp-2">{design.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-luxury-gold font-semibold">
                    ₹{(design.estimatedCost.amount / 100000).toFixed(1)}L
                  </div>
                  <button
                    className="flex items-center gap-2 text-luxury-gold hover:text-luxury-bronze transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(design._id);
                    }}
                  >
                    <span>View Details</span>
                    <FiEye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results Message */}
        {!loading && !error && recommendations.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
