import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = -(x - centerX) / 20;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full perspective-1000 cursor-luxury group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className={`relative w-full h-full preserve-3d duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className="absolute w-full backface-hidden">
          <div className="overflow-hidden rounded-xl bg-surface shadow-luxury group-hover:shadow-luxury-hover transition-all duration-300">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-luxury opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-display text-xl text-luxury-noir mb-2">
                {product.name}
              </h3>
              <p className="text-secondary-600 mb-4">
                {product.description}
              </p>
              
              {/* Features */}
              <div className="space-y-2 mb-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 rounded-full bg-luxury-gold mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-luxury-gold font-display text-xl">
                  ₹{product.price.toLocaleString()}
                </div>
                <button
                  onClick={() => setIsFlipped(true)}
                  className="btn bg-luxury-gold text-white hover:bg-luxury-gold/90 transform hover:scale-105 transition-all duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div className="h-full rounded-xl bg-surface p-6 shadow-luxury">
            <div className="h-full flex flex-col">
              <h4 className="font-display text-xl text-luxury-noir mb-4">
                Detailed Specifications
              </h4>
              
              {/* Specifications */}
              <div className="flex-grow space-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-luxury-gold/20 pb-2">
                    <span className="text-secondary-600">{key}</span>
                    <span className="font-medium text-luxury-noir">{value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button className="w-full btn bg-luxury-gold text-white hover:bg-luxury-gold/90 transform hover:scale-105 transition-all duration-300">
                  Book Consultation
                </button>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="w-full btn border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 transition-all duration-300"
                >
                  Back to Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Floating Elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-luxury-gold/10 rounded-full blur-xl animate-float" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-luxury-gold/5 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
    </motion.div>
  );
};

export default ProductCard;
