import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Project from '../models/project.model.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Create a new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      client,
      designer,
      designs,
      status,
      timeline,
      budget,
      roomDetails,
      materials
    } = req.body;

    // Log request body for debugging
    logger.info('Creating project with data:', {
      title,
      description,
      client,
      designer,
      designs,
      status,
      timeline,
      budget,
      roomDetails,
      materials
    });

    // Validate required fields
    if (!title || !description || !client || !designer || !designs || !roomDetails) {
      logger.error('Missing required fields:', { title, description, client, designer, designs, roomDetails });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Create project
    const project = new Project({
      title,
      description,
      client,
      designer,
      designs,
      status: status || 'planning',
      timeline: {
        startDate: timeline?.startDate || new Date(),
        endDate: timeline?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        milestones: []
      },
      budget: {
        total: budget?.total || 0,
        spent: budget?.spent || 0,
        currency: budget?.currency || 'INR'
      },
      roomDetails: {
        type: roomDetails.type,
        dimensions: roomDetails.dimensions || {}
      },
      materials: materials || []
    });

    logger.info('Created project object:', project);

    await project.save();
    logger.info('Saved project to database:', project._id);

    // Populate design and client details
    const populatedProject = await Project.findById(project._id)
      .populate('designs')
      .populate('client', 'name email')
      .populate('designer', 'name email');

    logger.info('Populated project:', populatedProject);

    res.status(201).json({
      success: true,
      project: populatedProject
    });
  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project',
      details: error.message
    });
  }
});

// Get all projects for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user._id })
      .populate('designs')
      .populate('designer', 'name email')
      .sort({ 'timeline.startDate': -1 });

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    logger.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
      details: error.message
    });
  }
});

// Get project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('designs')
      .populate('client', 'name email')
      .populate('designer', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if user has access to this project
    if (project.client._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    logger.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
      details: error.message
    });
  }
});

// Get projects by user ID
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    logger.info(`Fetching projects for user: ${userId}`);

    const projects = await Project.find({
      $or: [
        { client: userId },
        { designer: userId }
      ]
    })
    .populate('designer', 'name email')
    .populate('client', 'name email')
    .populate('designs');

    logger.info(`Found ${projects.length} projects for user ${userId}`);
    res.json(projects);
  } catch (error) {
    logger.error('Error fetching user projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user projects'
    });
  }
});

export default router;
