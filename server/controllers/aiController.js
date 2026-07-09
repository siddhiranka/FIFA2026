const aiService = require('../services/aiService');

const chat = async (req, res) => {
  try {
    const { message, language } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const response = await aiService.generalChat(message, language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ error: 'AI service unavailable', fallback: '⚽ Ask me about gates, transport, or facilities!' });
  }
};

const navigate = async (req, res) => {
  try {
    const { question, language } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });
    const response = await aiService.askNavigationAI(question, language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ error: 'Navigation AI unavailable' });
  }
};

const getCrowdAnalysis = async (req, res) => {
  try {
    const { language } = req.query;
    const response = await aiService.analyzeCrowd(language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ error: 'Crowd analysis unavailable' });
  }
};

const getTransportRec = async (req, res) => {
  try {
    const { origin, preference, language } = req.body;
    const response = await aiService.getTransportRecommendation(origin, preference, language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ error: 'Transport AI unavailable' });
  }
};

const getAccessibleRoute = async (req, res) => {
  try {
    const { destination, needs, language } = req.body;
    const response = await aiService.getAccessibleRoute(destination, needs, language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ error: 'Accessibility AI unavailable' });
  }
};

const getStaffSummary = async (req, res) => {
  try {
    const { language } = req.query;
    const response = await aiService.getStaffSummary(language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ error: 'Staff AI unavailable' });
  }
};

module.exports = { chat, navigate, getCrowdAnalysis, getTransportRec, getAccessibleRoute, getStaffSummary };
