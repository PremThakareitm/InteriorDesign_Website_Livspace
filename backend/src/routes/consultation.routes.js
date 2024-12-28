import express from 'express';
import Consultation from '../models/consultation.model.js';
import { authenticateToken } from '../middleware/auth.js';
import { isDesigner } from '../middleware/roles.js';
import logger from '../utils/logger.js';
import User from '../models/User.js';

const router = express.Router();

// Get all consultations for a designer
router.get('/designer-consultations', authenticateToken, isDesigner, async (req, res) => {
  try {
    logger.info(`Fetching consultations for designer ${req.user._id}`);
    
    const { status } = req.query;
    const query = { designer: req.user._id };
    if (status) query.status = status;

    logger.info('Query:', JSON.stringify(query));

    const consultations = await Consultation.find(query)
      .populate('userId', 'name email')
      .populate('projectId')
      .sort({ date: 1 });

    logger.info(`Retrieved ${consultations.length} consultations for designer ${req.user._id}`);
    
    if (consultations.length === 0) {
      logger.info('No consultations found for designer');
      return res.json([]);
    }

    res.json(consultations);
  } catch (error) {
    logger.error('Error fetching designer consultations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch consultations',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's consultations
router.get('/my-consultations', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user._id };
    if (status) query.status = status;

    const consultations = await Consultation.find(query)
      .populate('designer', 'name email')
      .populate('projectId')
      .sort({ date: 1 });

    logger.info(`Retrieved ${consultations.length} consultations for user ${req.user._id}`);
    res.json(consultations);
  } catch (error) {
    logger.error('Error fetching user consultations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming consultations
router.get('/upcoming', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    const query = {
      userId: req.user._id,
      date: { $gte: now },
      status: { $nin: ['cancelled', 'completed'] }
    };

    const consultations = await Consultation.find(query)
      .populate('designer', 'name email')
      .sort({ date: 1 })
      .limit(5);

    logger.info(`Retrieved ${consultations.length} upcoming consultations for user ${req.user._id}`);
    res.json(consultations);
  } catch (error) {
    logger.error('Error fetching upcoming consultations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single consultation
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('designer', 'name email')
      .populate('projectId')
      .populate({
        path: 'notes.author',
        select: 'name'
      });

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // Check if user is authorized to view this consultation
    if (
      consultation.userId.toString() !== req.user._id.toString() &&
      (!consultation.designer || consultation.designer._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ error: 'Not authorized to view this consultation' });
    }

    logger.info(`Retrieved consultation ${req.params.id}`);
    res.json(consultation);
  } catch (error) {
    logger.error('Error fetching consultation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new consultation
router.post('/', authenticateToken, async (req, res) => {
  try {
    const consultation = new Consultation({
      ...req.body,
      userId: req.user._id,
      status: 'pending'
    });

    await consultation.save();
    logger.info(`Created new consultation ${consultation._id}`);
    res.status(201).json(consultation);
  } catch (error) {
    logger.error('Error creating consultation:', error);
    res.status(400).json({ error: error.message });
  }
});

// Create a new consultation
router.post('/new', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      projectType,
      propertyType,
      budget,
      date,
      time,
      message
    } = req.body;

    logger.info('Creating new consultation with data:', JSON.stringify(req.body));

    // Find available designers
    const availableDesigners = await User.find({
      role: 'designer',
      availability: true
    }).select('_id name email');

    logger.info('Found designers:', JSON.stringify(availableDesigners));

    if (availableDesigners.length === 0) {
      logger.error('No available designers found');
      return res.status(400).json({ 
        success: false,
        error: 'No designers are currently available. Please try again later.' 
      });
    }

    logger.info(`Found ${availableDesigners.length} available designers`);

    // Randomly assign to an available designer
    const randomDesigner = availableDesigners[Math.floor(Math.random() * availableDesigners.length)];
    logger.info(`Selected designer: ${randomDesigner.name} (${randomDesigner._id})`);

    try {
      // Create new consultation
      const consultation = new Consultation({
        userId: req.user._id,
        designer: randomDesigner._id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        projectType: req.body.projectType,
        propertyType: req.body.propertyType,
        budget: req.body.budget,
        date: new Date(req.body.date),
        time: req.body.time,
        message: req.body.message,
        status: 'pending'
      });

      logger.info('Created consultation object:', JSON.stringify(consultation));

      await consultation.save();
      logger.info(`New consultation created by user ${req.user._id} and assigned to designer ${randomDesigner._id}`);

      // Populate user and designer details
      await consultation.populate([
        { path: 'userId', select: 'name email' },
        { path: 'designer', select: 'name email' }
      ]);

      res.status(201).json({ 
        success: true,
        consultation,
        message: 'Consultation request submitted successfully and assigned to a designer'
      });
    } catch (error) {
      logger.error('Error saving consultation:', error);
      res.status(400).json({ 
        success: false,
        error: error.message || 'Failed to create consultation'
      });
    }
  } catch (error) {
    logger.error('Error creating consultation:', error);
    res.status(400).json({ 
      success: false,
      error: error.message || 'Failed to create consultation'
    });
  }
});

// Update consultation status
router.patch('/:id/status', authenticateToken, isDesigner, async (req, res) => {
  try {
    const { status, updateMessage } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    consultation.status = status;
    await consultation.save();

    res.json({ 
      success: true,
      consultation,
      message: 'Consultation status updated successfully'
    });
  } catch (error) {
    logger.error('Error updating consultation status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add note to consultation
router.post('/:id/notes', authenticateToken, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // Check if user is authorized to add notes
    if (
      consultation.userId.toString() !== req.user._id.toString() &&
      (!consultation.designer || consultation.designer.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ error: 'Not authorized to add notes to this consultation' });
    }

    consultation.notes.push({
      content: req.body.content,
      author: req.user._id
    });

    await consultation.save();
    logger.info(`Added note to consultation ${consultation._id}`);
    res.json(consultation);
  } catch (error) {
    logger.error('Error adding note to consultation:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update consultation with project reference
router.patch('/:id', authenticateToken, isDesigner, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    if (consultation.designer && consultation.designer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this consultation' });
    }

    // Only allow updating specific fields
    const allowedUpdates = ['projectId', 'status'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    Object.assign(consultation, updates);
    await consultation.save();
    
    logger.info(`Updated consultation ${consultation._id}`);
    res.json(consultation);
  } catch (error) {
    logger.error('Error updating consultation:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
