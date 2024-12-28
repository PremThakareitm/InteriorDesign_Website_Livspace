import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    trim: true,
    enum: ['full', 'room', 'kitchen', 'bathroom', 'outdoor', 'office'],
    default: 'full'
  },
  propertyType: {
    type: String,
    trim: true,
    enum: ['Apartment', 'House', 'Villa', 'Studio', 'Penthouse', 'Commercial Space'],
    default: 'Apartment'
  },
  budget: {
    type: String,
    trim: true,
    enum: ['₹5L - ₹10L', '₹10L - ₹25L', '₹25L - ₹50L', '₹50L - ₹1Cr', 'Above ₹1Cr'],
    default: '₹5L - ₹10L'
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // Add a small buffer (1 minute) to account for processing time
        const now = new Date();
        now.setMinutes(now.getMinutes() - 1);
        return value > now;
      },
      message: 'Consultation date must be in the future'
    }
  },
  time: {
    type: String,
    required: true,
    trim: true,
    enum: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: [{
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Pre-save middleware to validate and format data
consultationSchema.pre('save', function(next) {
  // Ensure date is a valid Date object
  if (!(this.date instanceof Date)) {
    this.date = new Date(this.date);
  }

  // Validate date is not in the past
  if (this.date < new Date()) {
    next(new Error('Consultation date cannot be in the past'));
    return;
  }

  next();
});

// Method to format consultation for response
consultationSchema.methods.toJSON = function() {
  const obj = this.toObject();
  
  // Format date to ISO string
  if (obj.date) {
    obj.date = obj.date.toISOString();
  }

  return obj;
};

const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
