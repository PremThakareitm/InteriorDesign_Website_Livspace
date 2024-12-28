import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Design from '../models/design.model.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get designs with filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { style, budget, roomType, location } = req.query;
    
    // Build filter object
    const filter = {};
    if (style) filter.style = style;
    if (budget) filter.budget = budget;
    if (roomType) filter.roomType = roomType;
    if (location) filter.location = location;

    logger.info('Fetching designs with filters:', filter);

    const designs = await Design.find(filter)
      .populate('designer', 'name email')
      .limit(20);

    logger.info(`Found ${designs.length} designs matching filters`);

    res.json(designs);
  } catch (error) {
    logger.error('Error fetching designs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch designs' 
    });
  }
});

// Get design by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate('designer', 'name email');

    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }

    res.json(design);
  } catch (error) {
    logger.error('Error fetching design details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch design details'
    });
  }
});

// Get designs by user ID
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    logger.info(`Fetching designs for user: ${userId}`);

    const designs = await Design.find({ 
      $or: [
        { designer: userId },
        { client: userId }
      ]
    }).populate('designer', 'name email');

    logger.info(`Found ${designs.length} designs for user ${userId}`);
    res.json(designs);
  } catch (error) {
    logger.error('Error fetching user designs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user designs' 
    });
  }
});

export default router;
