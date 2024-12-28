import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import upload from '../middleware/upload.js'; // Assuming the upload middleware is defined in this file

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request body:', req.body); // Debug log
    const { name, email, password, role = 'user' } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password }); // Debug log
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user (password will be hashed by the pre-save hook)
    const user = new User({
      name,
      email,
      password,
      role,
      preferences: {
        styles: [],
        roomTypes: [],
        priceRange: 'mid'
      }
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Get public profile without password
    const userResponse = user.getPublicProfile();

    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user: user.getPublicProfile(), token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Google Login
router.post('/google-login', async (req, res) => {
  try {
    const { email, name, photoURL, uid } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        name,
        email,
        profileImage: photoURL,
        googleId: uid,
        emailVerified: true // Google accounts are already verified
      });
      await user.save();
    } else {
      // Update existing user's Google information
      user.googleId = uid;
      user.profileImage = photoURL || user.profileImage;
      user.emailVerified = true;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Error processing Google login' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, location, bio, preferences } = req.body;
    console.log('Update profile request:', { name, phone, location, bio, preferences });

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (bio) user.bio = bio;

    // Update preferences if provided
    if (preferences) {
      // Initialize preferences object if it doesn't exist
      if (!user.preferences) {
        user.preferences = {};
      }

      // Update styles if provided
      if (preferences.styles) {
        user.preferences.styles = preferences.styles.map(style => 
          style.toLowerCase().trim()
        ).filter(style => 
          ['modern', 'contemporary', 'traditional', 'minimalist', 'indo-modern'].includes(style)
        );
      }

      // Update roomTypes if provided
      if (preferences.roomTypes) {
        user.preferences.roomTypes = preferences.roomTypes.map(type => 
          type.toLowerCase().trim()
        ).filter(type => 
          ['living', 'bedroom', 'kitchen', 'bathroom', 'full'].includes(type)
        );
      }

      // Update priceRange if provided
      if (preferences.priceRange) {
        // Convert numeric range to category
        const total = preferences.priceRange.min + preferences.priceRange.max;
        let category;
        if (total <= 100000) category = 'budget';
        else if (total <= 300000) category = 'mid';
        else if (total <= 600000) category = 'premium';
        else category = 'luxury';
        
        user.preferences.priceRange = category;
      }
    }

    console.log('Saving updated user:', user);
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: error.message || 'Error updating profile' });
  }
});

// Upload profile image
router.post('/profile/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Save image path to user profile
    user.profileImage = req.file.path;
    await user.save();

    res.json({ 
      message: 'Profile image uploaded successfully',
      imageUrl: user.profileImage 
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
