import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [imagesLoaded, setImagesLoaded] = useState({
    hero: false,
    feature: false,
    portfolio: [false, false, false]
  });

  const handleImageLoad = (section, index = null) => {
    setImagesLoaded(prev => {
      if (index !== null) {
        const newPortfolio = [...prev.portfolio];
        newPortfolio[index] = true;
        return { ...prev, portfolio: newPortfolio };
      }
      return { ...prev, [section]: true };
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: imagesLoaded.hero ? 
            'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop")' :
            'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop"
          alt=""
          className="hidden"
          onLoad={() => handleImageLoad('hero')}
        />
        
        <div className="container-luxury relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Transform Your Space<br />
              <span className="bg-gradient-to-r from-luxury-gold to-luxury-bronze bg-clip-text text-transparent">
                Into a Masterpiece
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto font-light">
              Experience luxury interior design with cutting-edge 3D visualization
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              <Link
                to="/visualizer"
                className="btn-primary w-full sm:w-auto text-center px-8 py-4 text-lg font-medium hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-luxury-gold/30"
                aria-label="Try our 3D Visualizer"
              >
                Try 3D Visualizer
              </Link>
              <Link
                to="/consultation"
                className="btn-secondary w-full sm:w-auto text-center px-8 py-4 text-lg font-medium hover:scale-105 transform transition-all duration-300"
                aria-label="Book a consultation"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-50">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Visualize Your Dream Space
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              State-of-the-art 3D visualization technology at your fingertips
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {[
                {
                  title: "Realistic 3D Rendering",
                  description: "See your space come to life with photorealistic 3D renderings",
                  icon: "🎨"
                },
                {
                  title: "Interactive Design Tools",
                  description: "Customize materials, colors, and furniture in real-time",
                  icon: "🛠️"
                },
                {
                  title: "Expert Consultation",
                  description: "Get professional guidance from our experienced designers",
                  icon: "👨‍🎨"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-luxury hover:shadow-xl transition-shadow duration-300"
                >
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {feature.description}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <div className={`absolute inset-0 bg-gray-900 transition-opacity duration-500 ${imagesLoaded.feature ? 'opacity-0' : 'opacity-100'}`} />
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                  alt="3D Room Visualization Example"
                  className="w-full rounded-xl"
                  onLoad={() => handleImageLoad('feature')}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-luxury-gold to-luxury-bronze text-white p-6 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300">
                <p className="font-bold text-xl">Try it Now</p>
                <p className="text-sm opacity-90">Free for 7 days</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-luxury-gold to-luxury-bronze bg-clip-text text-transparent">
                Our Latest Projects
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most recent interior design transformations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace",
                title: "Modern Living Room",
                location: "Bangalore, Karnataka"
              },
              {
                image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77",
                title: "Luxury Kitchen",
                location: "Mumbai, Maharashtra"
              },
              {
                image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2",
                title: "Master Bedroom",
                location: "New Delhi, Delhi"
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative overflow-hidden rounded-xl shadow-luxury hover:shadow-2xl transition-shadow duration-500"
              >
                <div className={`absolute inset-0 bg-gray-900 transition-opacity duration-500 ${imagesLoaded.portfolio[index] ? 'opacity-0' : 'opacity-100'}`} />
                <img
                  src={`${project.image}?q=80&w=1932&auto=format&fit=crop`}
                  alt={project.title}
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  onLoad={() => handleImageLoad('portfolio', index)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-300">{project.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Start your journey to a beautifully designed home today
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/visualizer"
                className="btn-primary w-full sm:w-auto text-center px-8 py-4 text-lg font-medium"
                aria-label="Start designing your space"
              >
                Start Designing Now
              </Link>
              <Link
                to="/consultation"
                className="btn-secondary w-full sm:w-auto text-center px-8 py-4 text-lg font-medium"
                aria-label="Schedule a consultation call"
              >
                Schedule a Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
