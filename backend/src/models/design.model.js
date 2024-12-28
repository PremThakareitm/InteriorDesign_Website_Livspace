import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  style: {
    type: String,
    required: true,
    enum: ['modern', 'contemporary', 'traditional', 'minimalist', 'industrial', 'indo-modern']
  },
  roomType: {
    type: String,
    required: true,
    enum: ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'pooja', 'dining']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String
  }],
  features: [{
    type: String,
    required: true,
    trim: true
  }],
  materials: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    estimatedCost: Number,
    quantity: Number,
    unit: String
  }],
  dimensions: {
    length: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: Number,
    area: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['ft', 'm'],
      default: 'ft'
    }
  },
  estimatedCost: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  budget: {
    type: String,
    required: true,
    enum: ['budget', 'mid', 'premium', 'luxury']
  },
  timeline: {
    type: Number,
    required: true,
    min: 1,
    max: 52, // weeks
    default: 4
  },
  warranty: {
    type: Number,
    required: true,
    min: 0,
    max: 10, // years
    default: 1
  },
  specifications: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for like count
designSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Method to add a like
designSchema.methods.addLike = async function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    await this.save();
  }
  return this;
};

// Method to remove a like
designSchema.methods.removeLike = async function(userId) {
  this.likes = this.likes.filter(id => id.toString() !== userId.toString());
  await this.save();
  return this;
};

// Method to add a comment
designSchema.methods.addComment = async function(userId, content) {
  this.comments.push({
    user: userId,
    content
  });
  await this.save();
  return this;
};

// Indexes
designSchema.index({ roomType: 1, style: 1 });
designSchema.index({ budget: 1 });
designSchema.index({ designer: 1 });
designSchema.index({ status: 1 });
designSchema.index({ tags: 1 });
designSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Set toJSON options
designSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

const Design = mongoose.model('Design', designSchema);

export default Design;
