import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const designers = [
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    phone: '9876543210',
    role: 'designer',
    availability: true,
    preferences: {
      styles: ['modern', 'contemporary', 'minimalist'],
      roomTypes: ['living', 'bedroom', 'kitchen'],
      priceRange: 'premium',
      services: ['interior_design', 'consultation']
    },
    experience: {
      years: 8,
      projects: 150,
      specialization: ['Modern Interiors', 'Sustainable Design']
    }
  },
  {
    name: 'Michael Chen',
    email: 'michael@example.com',
    password: 'password123',
    phone: '9876543211',
    role: 'designer',
    availability: true,
    preferences: {
      styles: ['traditional', 'indo-modern'],
      roomTypes: ['full', 'living', 'kitchen'],
      priceRange: 'luxury',
      services: ['interior_design', 'execution', 'consultation']
    },
    experience: {
      years: 12,
      projects: 200,
      specialization: ['Luxury Homes', 'Commercial Spaces']
    }
  }
];

async function seedDesigners() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing designers
    await User.deleteMany({ role: 'designer' });
    console.log('Cleared existing designers');

    // Create new designers
    for (const designer of designers) {
      const hashedPassword = await bcrypt.hash(designer.password, 8);
      await User.create({
        ...designer,
        password: hashedPassword
      });
      console.log(`Created designer: ${designer.name}`);
    }

    console.log('Successfully seeded designers');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding designers:', error);
    process.exit(1);
  }
}

seedDesigners();
