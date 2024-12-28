import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation'
  },
  designs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Design'
  }],
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'review', 'completed', 'cancelled'],
    default: 'planning'
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'completed', 'delayed'],
        default: 'pending'
      }
    }]
  },
  budget: {
    total: Number,
    spent: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  roomDetails: {
    type: {
      type: String,
      enum: ['living', 'bedroom', 'kitchen', 'bathroom', 'office'],
      required: true
    },
    dimensions: {
      width: Number,
      length: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['ft', 'm'],
        default: 'ft'
      }
    },
    currentPhotos: [{
      type: String
    }]
  },
  materials: [{
    name: String,
    quantity: Number,
    unit: String,
    cost: Number,
    status: {
      type: String,
      enum: ['pending', 'ordered', 'delivered'],
      default: 'pending'
    }
  }],
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add indexes for better query performance
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ designer: 1, status: 1 });
projectSchema.index({ 'timeline.startDate': 1, 'timeline.endDate': 1 });

// Virtual for project duration in days
projectSchema.virtual('duration').get(function() {
  if (!this.timeline.startDate || !this.timeline.endDate) return null;
  const diffTime = Math.abs(this.timeline.endDate - this.timeline.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for budget remaining
projectSchema.virtual('budgetRemaining').get(function() {
  return this.budget.total - this.budget.spent;
});

// Virtual for completion percentage
projectSchema.virtual('completionPercentage').get(function() {
  if (!this.timeline.milestones || this.timeline.milestones.length === 0) return 0;
  const completedMilestones = this.timeline.milestones.filter(m => m.status === 'completed').length;
  return Math.round((completedMilestones / this.timeline.milestones.length) * 100);
});

// Method to add a milestone
projectSchema.methods.addMilestone = function(milestone) {
  this.timeline.milestones.push(milestone);
};

// Method to update milestone status
projectSchema.methods.updateMilestoneStatus = function(milestoneId, status) {
  const milestone = this.timeline.milestones.id(milestoneId);
  if (milestone) {
    milestone.status = status;
  }
};

// Method to add feedback
projectSchema.methods.addFeedback = function(userId, content, rating) {
  this.feedback.push({
    user: userId,
    content,
    rating
  });
};

// Method to add a note
projectSchema.methods.addNote = function(userId, content) {
  this.notes.push({
    author: userId,
    content
  });
};

// Method to add an attachment
projectSchema.methods.addAttachment = function(userId, attachment) {
  this.attachments.push({
    ...attachment,
    uploadedBy: userId
  });
};

// Method to update budget spent
projectSchema.methods.updateBudgetSpent = function(amount) {
  this.budget.spent = amount;
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
