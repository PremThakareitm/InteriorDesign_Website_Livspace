import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import PortfolioDetail from '../components/Portfolio/PortfolioDetail';
import { Link } from 'react-router-dom';
import '../styles/shared.css';

const PortfolioPage = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload all images
    const preloadImages = async () => {
      const imagePromises = portfolioItems.map(item => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = item.image;
          img.onload = () => {
            setImagesLoaded(prev => ({ ...prev, [item.id]: true }));
            resolve();
          };
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
      } catch (error) {
        console.error('Error preloading images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  const portfolioItems = [
    {
      id: 1,
      title: 'Contemporary Mumbai Apartment',
      category: 'living',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      date: '2023-12-15',
      style: 'Contemporary Indian',
      designer: 'Priya Sharma',
      area: '1200 sq ft',
      budget: '₹18 Lakhs',
      location: 'Mumbai, Maharashtra'
    },
    {
      id: 2,
      title: 'Modern Bangalore Kitchen',
      category: 'kitchen',
      image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80',
      date: '2023-12-10',
      style: 'Indo-Modern',
      designer: 'Rajesh Patel',
      area: '250 sq ft',
      budget: '₹12 Lakhs',
      location: 'Bangalore, Karnataka'
    },
    {
      id: 3,
      title: 'Vastu-Compliant Master Bedroom',
      category: 'bedroom',
      image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=800&q=80',
      date: '2023-12-05',
      style: 'Traditional Modern',
      designer: 'Anjali Khanna',
      area: '400 sq ft',
      budget: '₹8 Lakhs',
      location: 'Delhi NCR'
    },
    {
      id: 4,
      title: 'Luxury Pune Villa',
      category: 'living',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      date: '2023-12-01',
      style: 'Indo-Contemporary',
      designer: 'Vikram Mehta',
      area: '3500 sq ft',
      budget: '₹45 Lakhs',
      location: 'Pune, Maharashtra'
    },
    {
      id: 5,
      title: 'Traditional Jaipur Haveli',
      category: 'living',
      image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80',
      date: '2023-11-28',
      style: 'Royal Rajasthani',
      designer: 'Aditya Singh',
      area: '4000 sq ft',
      budget: '₹60 Lakhs',
      location: 'Jaipur, Rajasthan'
    },
    {
      id: 6,
      title: 'Modern Gurgaon Office',
      category: 'office',
      image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=800&q=80',
      date: '2023-11-25',
      style: 'Corporate Modern',
      designer: 'Neha Kapoor',
      area: '2800 sq ft',
      budget: '₹35 Lakhs',
      location: 'Gurgaon, Haryana'
    }
  ];

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Living Room', value: 'living' },
    { label: 'Kitchen', value: 'kitchen' },
    { label: 'Bedroom', value: 'bedroom' },
    { label: 'Office', value: 'office' },
  ];

  const sortOptions = [
    { label: 'Latest', value: 'date' },
    { label: 'Budget: High to Low', value: 'budget-desc' },
    { label: 'Budget: Low to High', value: 'budget-asc' },
    { label: 'Area: Largest', value: 'area-desc' }
  ];

  const filteredAndSortedItems = portfolioItems
    .filter(item => filter === 'all' || item.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'budget-desc':
          return parseInt(b.budget.replace(/[^0-9]/g, '')) - parseInt(a.budget.replace(/[^0-9]/g, ''));
        case 'budget-asc':
          return parseInt(a.budget.replace(/[^0-9]/g, '')) - parseInt(b.budget.replace(/[^0-9]/g, ''));
        case 'area-desc':
          return parseInt(b.area) - parseInt(a.area);
        default:
          return 0;
      }
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-1 mb-4">
            <span className="bg-gradient-to-r from-luxury-gold to-luxury-bronze bg-clip-text text-transparent">
              Design Portfolio
            </span>
          </h1>
          <p className="body-text max-w-2xl mx-auto">
            Explore our collection of stunning interior designs. Each project showcases our commitment to excellence and attention to detail.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {filterButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setFilter(button.value)}
                className={filter === button.value ? 'btn-primary' : 'btn-secondary'}
              >
                {button.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Portfolio Grid */}
        <div className="grid-layout">
          {filteredAndSortedItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="card"
              onClick={() => setSelectedProject(item)}
            >
              <div className="image-container">
                {(!imagesLoaded[item.id] || isLoading) && (
                  <div className="skeleton absolute inset-0" />
                )}
                <img
                  src={item.image}
                  alt={item.title}
                  className={`transition-opacity duration-300 ${
                    imagesLoaded[item.id] && !isLoading ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transform: 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">{item.style}</p>
                    <p className="text-xs opacity-75">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="heading-3 mb-4 group-hover:text-luxury-gold transition-colors duration-300">
                  {item.title}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="text-luxury-gold">Designer:</span>
                    <span>{item.designer}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-luxury-gold">Area:</span>
                    <span>{item.area}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-luxury-gold">Budget:</span>
                    <span>{item.budget}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-luxury-gold">Location:</span>
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <p className="body-text">No projects found matching your criteria.</p>
          </div>
        )}

        {/* Get Personalized Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Want Personalized Design Ideas?</h2>
              <p className="text-gray-600 mb-6">
                Get curated design recommendations based on your style preferences, budget, and space requirements.
                Our intelligent system will match you with designs that perfectly suit your needs.
              </p>
              <Link to="/recommendations">
                <button className="luxury-button-primary">
                  Get Personalized Ideas
                </button>
              </Link>
            </div>
            <div className="w-full md:w-1/3 aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                alt="Get personalized recommendations" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Portfolio Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <PortfolioDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PortfolioPage;
