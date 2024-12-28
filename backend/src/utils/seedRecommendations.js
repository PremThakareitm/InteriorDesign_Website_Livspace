import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Design from '../models/design.model.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const sampleDesigns = [
  {
    title: 'Contemporary Indian Living Room',
    description: 'A perfect blend of modern luxury and Indian heritage. Features designer furniture, traditional artifacts, and smart home integration.',
    style: 'indo-modern',
    roomType: 'living',
    images: [
      { url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg' },
      { url: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg' }
    ],
    features: [
      'Smart lighting system',
      'Traditional artwork display',
      'Custom entertainment unit',
      'Designer seating'
    ],
    tags: ['luxury', 'smart home', 'traditional elements'],
    dimensions: {
      length: 25,
      width: 18,
      height: 12,
      area: 450,
      unit: 'ft'
    },
    materials: [
      { name: 'Italian Marble Flooring', description: 'Premium imported marble', estimatedCost: 250000, quantity: 450, unit: 'sqft' },
      { name: 'Teak Wood Paneling', description: 'Premium grade teak wood', estimatedCost: 180000, quantity: 200, unit: 'sqft' },
      { name: 'Designer Wallpaper', description: 'Imported luxury wallpaper', estimatedCost: 80000, quantity: 400, unit: 'sqft' }
    ],
    estimatedCost: {
      amount: 1500000,
      currency: 'INR'
    },
    budget: 'premium',
    timeline: 8,
    warranty: 5
  },
  {
    title: 'Modern Indian Pooja Room',
    description: 'A serene and elegant prayer room combining traditional elements with contemporary design. Features marble flooring, custom mandir, and ambient lighting.',
    style: 'traditional',
    roomType: 'pooja',
    images: [
      { url: 'https://images.pexels.com/photos/6585614/pexels-photo-6585614.jpeg' },
      { url: 'https://images.pexels.com/photos/6585615/pexels-photo-6585615.jpeg' }
    ],
    features: [
      'Custom-designed mandir',
      'Marble flooring',
      'Mood lighting',
      'Storage for puja items'
    ],
    tags: ['spiritual', 'traditional', 'elegant'],
    dimensions: {
      length: 10,
      width: 8,
      height: 10,
      area: 80,
      unit: 'ft'
    },
    materials: [
      { name: 'Marble Flooring', description: 'Premium white marble', estimatedCost: 120000, quantity: 80, unit: 'sqft' },
      { name: 'Teak Wood Mandir', description: 'Custom-carved mandir', estimatedCost: 250000, quantity: 1, unit: 'piece' },
      { name: 'LED Lighting', description: 'Ambient lighting system', estimatedCost: 50000, quantity: 1, unit: 'set' }
    ],
    estimatedCost: {
      amount: 800000,
      currency: 'INR'
    },
    budget: 'premium',
    timeline: 6,
    warranty: 5
  },
  {
    title: 'Luxury Indian Kitchen',
    description: 'Modern kitchen with traditional Indian cooking requirements. Features premium appliances, spacious counters, and efficient storage solutions.',
    style: 'modern',
    roomType: 'kitchen',
    images: [
      { url: 'https://images.pexels.com/photos/7061674/pexels-photo-7061674.jpeg' },
      { url: 'https://images.pexels.com/photos/7061675/pexels-photo-7061675.jpeg' }
    ],
    features: [
      'Modular storage',
      'Premium appliances',
      'Separate wet kitchen',
      'Breakfast counter'
    ],
    tags: ['modular kitchen', 'luxury appliances', 'storage solutions'],
    dimensions: {
      length: 20,
      width: 15,
      height: 10,
      area: 300,
      unit: 'ft'
    },
    materials: [
      { name: 'Quartz Countertop', description: 'Premium quartz', estimatedCost: 200000, quantity: 100, unit: 'sqft' },
      { name: 'Modular Units', description: 'Imported modular systems', estimatedCost: 800000, quantity: 1, unit: 'set' },
      { name: 'Premium Appliances', description: 'High-end kitchen appliances', estimatedCost: 500000, quantity: 1, unit: 'set' }
    ],
    estimatedCost: {
      amount: 2000000,
      currency: 'INR'
    },
    budget: 'luxury',
    timeline: 10,
    warranty: 5
  },
  {
    title: 'Contemporary Master Bedroom',
    description: 'Luxurious master bedroom with walk-in wardrobe and sitting area. Features premium furnishings and smart automation.',
    style: 'modern',
    roomType: 'bedroom',
    images: [
      { url: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg' },
      { url: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg' }
    ],
    features: [
      'Walk-in wardrobe',
      'Automated curtains',
      'Mood lighting',
      'Entertainment unit'
    ],
    tags: ['luxury bedroom', 'smart features', 'walk-in wardrobe'],
    dimensions: {
      length: 18,
      width: 16,
      height: 12,
      area: 288,
      unit: 'ft'
    },
    materials: [
      { name: 'Wooden Flooring', description: 'Engineered wood', estimatedCost: 180000, quantity: 288, unit: 'sqft' },
      { name: 'Custom Wardrobe', description: 'Premium wardrobe system', estimatedCost: 400000, quantity: 1, unit: 'set' },
      { name: 'Automation System', description: 'Smart room controls', estimatedCost: 150000, quantity: 1, unit: 'set' }
    ],
    estimatedCost: {
      amount: 1200000,
      currency: 'INR'
    },
    budget: 'premium',
    timeline: 8,
    warranty: 5
  },
  {
    title: 'Traditional Dining Room',
    description: 'Elegant dining space with traditional Indian elements. Features custom dining set, display units, and traditional decor.',
    style: 'traditional',
    roomType: 'dining',
    images: [
      { url: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg' },
      { url: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg' }
    ],
    features: [
      'Custom dining set',
      'Display cabinet',
      'Traditional artwork',
      'Mood lighting'
    ],
    tags: ['traditional dining', 'family space', 'elegant'],
    dimensions: {
      length: 16,
      width: 14,
      height: 12,
      area: 224,
      unit: 'ft'
    },
    materials: [
      { name: 'Marble Flooring', description: 'Premium marble', estimatedCost: 160000, quantity: 224, unit: 'sqft' },
      { name: 'Custom Furniture', description: 'Handcrafted dining set', estimatedCost: 350000, quantity: 1, unit: 'set' },
      { name: 'Display Units', description: 'Custom display cabinets', estimatedCost: 200000, quantity: 2, unit: 'pieces' }
    ],
    estimatedCost: {
      amount: 1000000,
      currency: 'INR'
    },
    budget: 'premium',
    timeline: 6,
    warranty: 5
  }
];

async function seedDesigns() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a designer user
    const designer = await User.findOne({ role: 'designer' });
    if (!designer) {
      console.log('No designer found. Please seed users first.');
      process.exit(1);
    }

    // Clear existing designs
    await Design.deleteMany({});
    console.log('Cleared existing designs');

    // Add designer reference to each design
    const designsWithDesigner = sampleDesigns.map(design => ({
      ...design,
      designer: designer._id
    }));

    // Insert new designs
    await Design.insertMany(designsWithDesigner);
    console.log('Designs seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding designs:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDesigns();
