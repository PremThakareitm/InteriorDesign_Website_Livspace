import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoomVisualizer from '../components/RoomVisualizer';
import { FiCopy, FiCamera, FiShare2, FiSave, FiDownload, FiZoomIn, FiZoomOut, FiRotateCw, FiSun } from 'react-icons/fi';
import { BiPalette, BiHome, BiCrown, BiCube, BiLayer, BiPaint } from 'react-icons/bi';
import { MdOutlineTexture, MdOutlineLightMode, MdOutlineDarkMode } from 'react-icons/md';
import '../styles/visualizer.css';

const roomTypes = [
  {
    id: 'living',
    name: 'Living Room',
    icon: '🛋️',
    description: 'L-shaped Sofa • Entertainment Unit • Coffee Table',
    features: ['Open Layout', 'Natural Light', 'Entertainment Space'],
    preview: '/images/rooms/living-preview.jpg'
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    icon: '🛏️',
    description: 'King Size Bed • Walk-in Wardrobe • Seating Area',
    features: ['Spacious Design', 'Walk-in Closet', 'En-suite Bathroom'],
    preview: '/images/rooms/bedroom-preview.jpg'
  },
  {
    id: 'kitchen',
    name: 'Modern Kitchen',
    icon: '🍳',
    description: 'Island Counter • Modern Appliances • Storage Units',
    features: ['Island Counter', 'Smart Appliances', 'Ample Storage'],
    preview: '/images/rooms/kitchen-preview.jpg'
  },
  {
    id: 'office',
    name: 'Home Office',
    icon: '💼',
    description: 'Work Desk • Ergonomic Chair • Storage Solutions',
    features: ['Ergonomic Setup', 'Built-in Storage', 'Video Call Ready'],
    preview: '/images/rooms/office-preview.jpg'
  },
  {
    id: 'dining',
    name: 'Dining Room',
    icon: '🍽️',
    description: 'Dining Table • Designer Chairs • Chandelier',
    features: ['Statement Lighting', 'Comfortable Seating', 'Serving Area'],
    preview: '/images/rooms/dining-preview.jpg'
  }
];

const styles = [
  { id: 'modern', name: 'Modern', icon: <BiHome />, accent: '#4A90E2' },
  { id: 'minimalist', name: 'Minimalist', icon: <BiCube />, accent: '#9B9B9B' },
  { id: 'contemporary', name: 'Contemporary', icon: <BiLayer />, accent: '#50E3C2' },
  { id: 'traditional', name: 'Traditional', icon: <BiCrown />, accent: '#F5A623' },
  { id: 'indo-modern', name: 'Indo-Modern', icon: <BiPaint />, accent: '#D0021B' }
];

const VisualizerPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(roomTypes[0]);
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [wallColor, setWallColor] = useState('#FFFFFF');
  const [floorColor, setFloorColor] = useState('#F5F5F5');
  const [lightingMode, setLightingMode] = useState('day');
  const [showTutorial, setShowTutorial] = useState(true);
  const [cameraPosition, setCameraPosition] = useState({ zoom: 1, rotation: 0 });
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTutorial(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCapture = () => {
    // Implement screen capture functionality
    console.log('Capturing visualization...');
  };

  const handleShare = () => {
    // Implement sharing functionality
    console.log('Sharing visualization...');
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving visualization...');
  };

  return (
    <div className="visualizer-container">
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="tutorial-overlay"
          >
            <div className="tutorial-content">
              <BiCrown className="text-4xl text-gold" />
              <h3>Welcome to Premium 3D Visualizer</h3>
              <p>Experience your dream space in stunning detail</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="visualizer-layout">
        {/* Left Panel - Room & Style Selection */}
        <motion.div
          className="panel options-panel"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="panel-header">
            <BiHome className="text-gold" />
            <span>Room Selection</span>
          </div>
          <div className="room-grid">
            {roomTypes.map((room) => (
              <motion.div
                key={room.id}
                className={`option-card ${selectedRoom.id === room.id ? 'selected' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="option-icon">{room.icon}</div>
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <div className="features-list">
                  {room.features.map((feature) => (
                    <span key={feature} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Center - 3D Visualization */}
        <div className="visualization-container">
          <div className="visualization-header">
            <h2>
              <span className="text-gold">{selectedRoom.name}</span>
              <span className="text-white"> in </span>
              <span className="text-gold">{selectedStyle.name}</span>
              <span className="text-white"> Style</span>
            </h2>
          </div>
          
          <div className="visualization-canvas">
            <RoomVisualizer
              room={selectedRoom.id}
              style={selectedStyle.id}
              wallColor={wallColor}
              floorColor={floorColor}
              lighting={lightingMode}
              cameraPosition={cameraPosition}
            />
            
            {showControls && (
              <div className="canvas-controls">
                <button onClick={() => setCameraPosition(prev => ({ ...prev, zoom: prev.zoom + 0.1 }))}>
                  <FiZoomIn />
                </button>
                <button onClick={() => setCameraPosition(prev => ({ ...prev, zoom: prev.zoom - 0.1 }))}>
                  <FiZoomOut />
                </button>
                <button onClick={() => setCameraPosition(prev => ({ ...prev, rotation: prev.rotation + 90 }))}>
                  <FiRotateCw />
                </button>
                <button onClick={() => setLightingMode(prev => prev === 'day' ? 'night' : 'day')}>
                  {lightingMode === 'day' ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
                </button>
              </div>
            )}
          </div>

          <div className="action-bar">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCapture}
              className="action-button"
            >
              <FiCamera />
              <span>Capture</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="action-button"
            >
              <FiShare2 />
              <span>Share</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="action-button primary"
            >
              <FiSave />
              <span>Save Design</span>
            </motion.button>
          </div>
        </div>

        {/* Right Panel - Style & Color Selection */}
        <motion.div
          className="panel controls-panel"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="panel-header">
            <BiPalette className="text-gold" />
            <span>Customize Style</span>
          </div>
          
          <div className="style-section">
            <h3>Design Style</h3>
            <div className="style-grid">
              {styles.map((style) => (
                <motion.div
                  key={style.id}
                  className={`style-card ${selectedStyle.id === style.id ? 'selected' : ''}`}
                  style={{ '--accent-color': style.accent }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStyle(style)}
                >
                  {style.icon}
                  <span>{style.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="color-section">
            <h3>Color Scheme</h3>
            <div className="color-picker">
              <div className="color-field">
                <label>Wall Color</label>
                <input
                  type="color"
                  value={wallColor}
                  onChange={(e) => setWallColor(e.target.value)}
                  className="color-input"
                />
              </div>
              <div className="color-field">
                <label>Floor Color</label>
                <input
                  type="color"
                  value={floorColor}
                  onChange={(e) => setFloorColor(e.target.value)}
                  className="color-input"
                />
              </div>
            </div>
          </div>

          <div className="texture-section">
            <h3>Material & Texture</h3>
            <div className="texture-grid">
              <div className="texture-option">
                <MdOutlineTexture />
                <span>Wooden</span>
              </div>
              <div className="texture-option">
                <MdOutlineTexture />
                <span>Marble</span>
              </div>
              <div className="texture-option">
                <MdOutlineTexture />
                <span>Carpet</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisualizerPage;
