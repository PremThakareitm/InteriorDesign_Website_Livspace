import express from 'express';
import Design from '../models/design.model.js';
import { authenticateToken } from '../middleware/auth.js';
import { isDesigner } from '../middleware/roles.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all designs (with filters)
router.get('/', async (req, res) => {
  try {
    const { style, roomType, tags, designer, status = 'published' } = req.query;
    const query = { status };

    if (style) query.style = style;
    if (roomType) query.roomType = roomType;
    if (tags) query.tags = { $in: tags.split(',') };
    if (designer) query.designer = designer;

    const designs = await Design.find(query)
      .populate('designer', 'name')
      .sort('-createdAt');

    logger.info(`Retrieved ${designs.length} designs`);
    res.json(designs);
  } catch (error) {
    logger.error('Error fetching designs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's designs
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const designs = await Design.find({
      designer: req.params.userId,
      status: { $ne: 'archived' }
    })
    .populate('designer', 'name')
    .sort('-createdAt');

    logger.info(`Retrieved ${designs.length} designs for user ${req.params.userId}`);
    res.json(designs);
  } catch (error) {
    logger.error('Error fetching user designs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single design
router.get('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate('designer', 'name')
      .populate('comments.user', 'name');

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    logger.info(`Retrieved design ${req.params.id}`);
    res.json(design);
  } catch (error) {
    logger.error('Error fetching design:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new design
router.post('/', authenticateToken, isDesigner, async (req, res) => {
  try {
    const design = new Design({
      ...req.body,
      designer: req.user._id
    });

    await design.save();
    logger.info(`Created new design ${design._id}`);
    res.status(201).json(design);
  } catch (error) {
    logger.error('Error creating design:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update design
router.patch('/:id', authenticateToken, isDesigner, async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    if (design.designer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this design' });
    }

    // Only allow updating specific fields
    const allowedUpdates = [
      'title', 'description', 'style', 'roomType', 'images',
      'tags', 'dimensions', 'materials', 'estimatedCost', 'status'
    ];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    Object.assign(design, updates);
    await design.save();

    logger.info(`Updated design ${design._id}`);
    res.json(design);
  } catch (error) {
    logger.error('Error updating design:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete design (soft delete by setting status to archived)
router.delete('/:id', authenticateToken, isDesigner, async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    if (design.designer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this design' });
    }

    design.status = 'archived';
    await design.save();

    logger.info(`Archived design ${design._id}`);
    res.json({ message: 'Design archived successfully' });
  } catch (error) {
    logger.error('Error archiving design:', error);
    res.status(500).json({ error: error.message });
  }
});

// Like/unlike design
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    const liked = design.likes.includes(req.user._id);
    if (liked) {
      design.removeLike(req.user._id);
      logger.info(`User ${req.user._id} unliked design ${design._id}`);
    } else {
      design.addLike(req.user._id);
      logger.info(`User ${req.user._id} liked design ${design._id}`);
    }

    await design.save();
    res.json({ liked: !liked, likeCount: design.likes.length });
  } catch (error) {
    logger.error('Error updating design likes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add comment to design
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    design.addComment(req.user._id, req.body.content);
    await design.save();

    const populatedDesign = await Design.findById(design._id)
      .populate('comments.user', 'name');

    logger.info(`Added comment to design ${design._id}`);
    res.json(populatedDesign.comments);
  } catch (error) {
    logger.error('Error adding comment to design:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
