import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Design from '../models/design.model.js';
import User from '../models/User.js';

dotenv.config();

const styles = ['modern', 'contemporary', 'traditional', 'minimalist', 'industrial', 'indo-modern'];
const roomTypes = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'pooja', 'dining'];
const budgets = ['budget', 'mid', 'premium', 'luxury'];

// Helper function to get room type specific images
const getRoomImages = (roomType, style, index) => {
  const imageMap = {
    living: [
      [
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg'
      ],
      [
        'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg',
        'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg'
      ]
    ],
    bedroom: [
      [
        'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
        'https://images.pexels.com/photos/1454805/pexels-photo-1454805.jpeg'
      ],
      [
        'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
        'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg'
      ]
    ],
    kitchen: [
      [
        'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg',
        'https://images.pexels.com/photos/1599792/pexels-photo-1599792.jpeg'
      ],
      [
        'https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg',
        'https://images.pexels.com/photos/3214065/pexels-photo-3214065.jpeg'
      ]
    ],
    bathroom: [
      [
        'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg',
        'https://images.pexels.com/photos/6585758/pexels-photo-6585758.jpeg'
      ],
      [
        'https://images.pexels.com/photos/6585764/pexels-photo-6585764.jpeg',
        'https://images.pexels.com/photos/6585766/pexels-photo-6585766.jpeg'
      ]
    ],
    office: [
      [
        'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg',
        'https://images.pexels.com/photos/1170413/pexels-photo-1170413.jpeg'
      ],
      [
        'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg',
        'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg'
      ]
    ],
    pooja: [
      [
        'https://images.pexels.com/photos/6186826/pexels-photo-6186826.jpeg',
        'https://images.pexels.com/photos/6186827/pexels-photo-6186827.jpeg'
      ],
      [
        'https://images.pexels.com/photos/6186828/pexels-photo-6186828.jpeg',
        'https://images.pexels.com/photos/6186829/pexels-photo-6186829.jpeg'
      ]
    ],
    dining: [
      [
        'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg',
        'https://images.pexels.com/photos/1080697/pexels-photo-1080697.jpeg'
      ],
      [
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg',
        'https://images.pexels.com/photos/1080722/pexels-photo-1080722.jpeg'
      ]
    ]
  };

  // Get image set based on index (0 or 1)
  const imageSet = imageMap[roomType][index % 2];
  
  return imageSet.map(url => ({
    url,
    caption: `${style} ${roomType} design - View ${imageSet.indexOf(url) + 1}`
  }));
};

// Helper function to get style-specific features
const getStyleFeatures = (style, roomType) => {
  const features = {
    modern: [
      'Clean lines and minimalist design',
      'Smart home integration',
      'Contemporary lighting fixtures',
      'Open floor plan concept'
    ],
    contemporary: [
      'Current design trends',
      'Mixed material palette',
      'Comfortable and inviting',
      'Flexible space usage'
    ],
    traditional: [
      'Classic design elements',
      'Rich wood finishes',
      'Ornate details',
      'Symmetrical layout'
    ],
    minimalist: [
      'Clutter-free design',
      'Essential elements only',
      'Neutral color palette',
      'Functional storage solutions'
    ],
    industrial: [
      'Exposed structural elements',
      'Raw material finishes',
      'Urban aesthetic',
      'High ceilings'
    ],
    'indo-modern': [
      'Fusion of Indian and modern elements',
      'Traditional motifs with modern twist',
      'Balanced color scheme',
      'Cultural elements integration'
    ]
  };

  return [
    ...features[style],
    `Optimized for ${roomType} functionality`,
    'Custom lighting system',
    'Premium materials'
  ];
};

// Helper function to get style-specific materials
const getStyleMaterials = (style, roomType, budget) => {
  const materials = {
    modern: {
      primary: 'Glass and Steel',
      secondary: 'High-grade Composites'
    },
    contemporary: {
      primary: 'Mixed Materials',
      secondary: 'Natural Stone'
    },
    traditional: {
      primary: 'Solid Wood',
      secondary: 'Natural Fabrics'
    },
    minimalist: {
      primary: 'Engineered Wood',
      secondary: 'Matte Finishes'
    },
    industrial: {
      primary: 'Concrete and Metal',
      secondary: 'Reclaimed Wood'
    },
    'indo-modern': {
      primary: 'Premium Wood',
      secondary: 'Stone and Metal'
    }
  };

  const { primary, secondary } = materials[style];
  const costMultiplier = {
    budget: 1,
    mid: 1.5,
    premium: 2.5,
    luxury: 4
  };

  return [
    {
      name: primary,
      description: `Premium ${primary} suited for ${style} ${roomType} design`,
      estimatedCost: Math.floor(150000 * costMultiplier[budget]),
      quantity: 100,
      unit: 'sqft'
    },
    {
      name: secondary,
      description: `Designer ${secondary} matching ${style} aesthetics`,
      estimatedCost: Math.floor(100000 * costMultiplier[budget]),
      quantity: 1,
      unit: 'set'
    }
  ];
};

// Helper function to generate dimensions based on room type
const getDimensions = (roomType) => {
  const dimensions = {
    living: { length: 20, width: 15, area: 300, height: 12 },
    bedroom: { length: 15, width: 12, area: 180, height: 10 },
    kitchen: { length: 12, width: 10, area: 120, height: 10 },
    bathroom: { length: 8, width: 6, area: 48, height: 10 },
    office: { length: 16, width: 14, area: 224, height: 10 },
    pooja: { length: 8, width: 8, area: 64, height: 10 },
    dining: { length: 14, width: 12, area: 168, height: 10 }
  };
  return { ...dimensions[roomType], unit: 'ft' };
};

// Helper function to generate cost based on budget
const getCost = (budget) => {
  const costs = {
    budget: { min: 300000, max: 800000 },
    mid: { min: 800000, max: 1500000 },
    premium: { min: 1500000, max: 3000000 },
    luxury: { min: 3000000, max: 10000000 }
  };
  const range = costs[budget];
  return {
    amount: Math.floor(Math.random() * (range.max - range.min) + range.min),
    currency: 'INR'
  };
};

// Generate designs for each combination
const generateDesigns = () => {
  const designs = [];

  // Generate designs for each style
  styles.forEach(style => {
    // For each room type
    roomTypes.forEach(roomType => {
      // For each budget
      budgets.forEach(budget => {
        // Create two designs for each combination
        for (let i = 0; i < 2; i++) {
          const design = {
            title: `${style.charAt(0).toUpperCase() + style.slice(1)} ${roomType.charAt(0).toUpperCase() + roomType.slice(1)} Design ${i + 1}`,
            description: `A beautiful ${style} ${roomType} design that perfectly balances aesthetics and functionality. This template can be customized to suit your specific space and requirements across India.`,
            style,
            roomType,
            budget,
            timeline: Math.floor(Math.random() * 12) + 4, // 4-16 weeks
            warranty: Math.floor(Math.random() * 3) + 1, // 1-3 years
            dimensions: getDimensions(roomType),
            estimatedCost: getCost(budget),
            images: getRoomImages(roomType, style, i),
            features: getStyleFeatures(style, roomType),
            materials: getStyleMaterials(style, roomType, budget)
          };
          designs.push(design);
        }
      });
    });
  });

  return designs;
};

async function seedDesigns() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a designer
    const designer = await User.findOne({ role: 'designer' });
    if (!designer) {
      console.error('No designer found. Please run seedDesigners.js first');
      process.exit(1);
    }

    // Clear existing designs
    await Design.deleteMany({});
    console.log('Cleared existing designs');

    // Generate and add designer reference to each design
    const designs = generateDesigns();
    const designsWithDesigner = designs.map(design => ({
      ...design,
      designer: designer._id
    }));

    // Create new designs
    await Design.insertMany(designsWithDesigner);
    console.log(`Successfully seeded ${designsWithDesigner.length} designs`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding designs:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDesigns();
