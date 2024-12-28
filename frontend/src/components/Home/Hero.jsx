import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="container-luxury relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold">
            <span className="gradient-text luxury-shadow">
              Transform Your Space
            </span>
            <br />
            <span className="text-white luxury-shadow">
              With Indian Elegance
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white luxury-shadow max-w-2xl mx-auto">
            Experience luxury interior design with Vastu-compliant spaces and modern aesthetics
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link 
              to="/recommendations"
              className="w-full sm:w-auto"
            >
              <button className="luxury-button-secondary w-full">
                Get Design Ideas
              </button>
            </Link>
            
            <Link 
              to="/consultation"
              className="w-full sm:w-auto"
            >
              <button className="luxury-button-primary w-full">
                Book Consultation
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-10" />
    </section>
  );
};

export default Hero;
