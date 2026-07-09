const Incident = require('../models/Incident');
const aiService = require('../services/aiService');

// In-memory fallback if DB not connected
let inMemoryIncidents = [];
let useMemory = false;

const checkDB = () => {
  const { readyState } = require('mongoose').connection;
  useMemory = readyState !== 1;
};

const getAll = async (req, res) => {
  checkDB();
  try {
    const incidents = useMemory ? inMemoryIncidents : await Incident.find().sort({ createdAt: -1 }).limit(50);
    res.json(incidents);
  } catch {
    res.json(inMemoryIncidents);
  }
};

const create = async (req, res) => {
  checkDB();
  const { type, location, priority, description, reportedBy } = req.body;
  if (!type || !location || !priority || !description) {
    return res.status(400).json({ error: 'All fields required' });
  }

  let aiData = {};
  try {
    aiData = await aiService.categorizeIncident({ type, location, priority, description });
  } catch {}

  const incidentData = {
    type, location, priority, description,
    reportedBy: reportedBy || 'Anonymous',
    status: 'submitted',
    aiSeverity: aiData.severity || priority,
    aiRecommendation: aiData.recommendation || 'Dispatch staff to location',
    createdAt: new Date(), updatedAt: new Date()
  };

  try {
    if (useMemory) {
      const incident = { ...incidentData, _id: Date.now().toString() };
      inMemoryIncidents.unshift(incident);
      return res.status(201).json(incident);
    }
    const incident = await Incident.create(incidentData);
    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create incident' });
  }
};

const updateStatus = async (req, res) => {
  checkDB();
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (useMemory) {
      const idx = inMemoryIncidents.findIndex(i => i._id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      inMemoryIncidents[idx].status = status;
      return res.json(inMemoryIncidents[idx]);
    }
    const incident = await Incident.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
    if (!incident) return res.status(404).json({ error: 'Not found' });
    res.json(incident);
  } catch {
    res.status(500).json({ error: 'Failed to update' });
  }
};

module.exports = { getAll, create, updateStatus };
