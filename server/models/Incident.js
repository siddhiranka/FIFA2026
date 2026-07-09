const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['medical', 'security', 'crowd', 'facility', 'fire', 'lost', 'other']
  },
  location: { type: String, required: true },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  description: { type: String, required: true, maxlength: 1000 },
  status: {
    type: String,
    default: 'submitted',
    enum: ['submitted', 'assigned', 'investigating', 'resolved']
  },
  aiSeverity: { type: String },
  aiRecommendation: { type: String },
  assignedTo: { type: String },
  reportedBy: { type: String, default: 'Anonymous' },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
