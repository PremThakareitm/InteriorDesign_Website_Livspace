import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/shared.css';

const PortfolioDetail = ({ project, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = projectDetails.images.map((image, index) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image;
          img.onload = () => {
            setImagesLoaded(prev => ({ ...prev, [index]: true }));
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

  const projectDetails = {
    description: "This luxurious design combines modern aesthetics with practical functionality. The space features custom lighting solutions, premium materials, and a carefully curated color palette that creates a harmonious atmosphere.",
    features: [
      "Custom LED lighting system",
      "Premium hardwood flooring",
      "Bespoke furniture pieces",
      "Smart home integration",
      "Acoustic optimization"
    ],
    materials: [
      "Italian marble",
      "Solid oak wood",
      "Brushed gold fixtures",
      "Premium wallcoverings",
      "Designer fabrics"
    ],
    images: [
      project.image,
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=800&q=80'
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <div 
        className="min-h-screen px-4 py-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content">
          {/* Header */}
          <div className="relative h-96">
            {(!imagesLoaded[selectedImage] || isLoading) && (
              <div className="skeleton absolute inset-0" />
            )}
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={projectDetails.images[selectedImage]}
              alt={project.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imagesLoaded[selectedImage] && !isLoading ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex gap-2 p-4 bg-gray-100">
            {projectDetails.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-luxury-gold' : ''
                }`}
              >
                {(!imagesLoaded[index] || isLoading) && (
                  <div className="skeleton absolute inset-0" />
                )}
                <img
                  src={img}
                  alt=""
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imagesLoaded[index] && !isLoading ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-2">{project.title}</h2>
              <span className="px-4 py-2 rounded-full bg-luxury-gold/10 text-luxury-gold text-sm font-medium">
                {project.style}
              </span>
            </div>

            <p className="body-text mb-8">{projectDetails.description}</p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="heading-3 mb-4">Features</h3>
                <ul className="space-y-2">
                  {projectDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center body-text">
                      <span className="w-2 h-2 rounded-full bg-luxury-gold mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="heading-3 mb-4">Materials Used</h3>
                <ul className="space-y-2">
                  {projectDetails.materials.map((material, index) => (
                    <li key={index} className="flex items-center body-text">
                      <span className="w-2 h-2 rounded-full bg-luxury-gold mr-3" />
                      {material}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/consultation" className="btn-primary">
                Book Similar Design
              </Link>
              <Link to="/visualizer" className="btn-secondary">
                Try in 3D Visualizer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioDetail;
