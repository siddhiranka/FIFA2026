const aiService = require('../services/aiService');

const chat = async (req, res) => {
  try {
    const { message, language } = req.body;
    console.log(`[API] POST /api/ai/chat message="${message}" language="${language}"`);
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const response = await aiService.generalChat(message, language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    console.error(`[API ERROR] POST /api/ai/chat failed:`, err);
    res.status(500).json({ error: 'AI service unavailable', fallback: '⚽ Ask me about gates, transport, or facilities!' });
  }
};

const navigate = async (req, res) => {
  try {
    const { question, language } = req.body;
    console.log(`[API] POST /api/ai/navigate question="${question}" language="${language}"`);
    if (!question) return res.status(400).json({ error: 'Question is required' });
    const response = await aiService.askNavigationAI(question, language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    console.error(`[API ERROR] POST /api/ai/navigate failed:`, err);
    res.status(500).json({ error: 'Navigation AI unavailable' });
  }
};

const getCrowdAnalysis = async (req, res) => {
  try {
    const { language } = req.query;
    console.log(`[API] GET /api/ai/crowd-analysis language="${language}"`);
    const response = await aiService.analyzeCrowd(language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    console.error(`[API ERROR] GET /api/ai/crowd-analysis failed:`, err);
    res.status(500).json({ error: 'Crowd analysis unavailable' });
  }
};

const getTransportRec = async (req, res) => {
  try {
    const { origin, preference, language } = req.body;
    console.log(`[API] POST /api/ai/transport origin="${origin}" preference="${preference}" language="${language}"`);
    const response = await aiService.getTransportRecommendation(origin, preference, language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    console.error(`[API ERROR] POST /api/ai/transport failed:`, err);
    res.status(500).json({ error: 'Transport AI unavailable' });
  }
};

const getAccessibleRoute = async (req, res) => {
  try {
    const { destination, needs, language } = req.body;
    console.log(`[API] POST /api/ai/accessible-route destination="${destination}" needs="${needs}" language="${language}"`);
    const response = await aiService.getAccessibleRoute(destination, needs, language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    console.error(`[API ERROR] POST /api/ai/accessible-route failed:`, err);
    res.status(500).json({ error: 'Accessibility AI unavailable' });
  }
};

const getStaffSummary = async (req, res) => {
  try {
    const { language } = req.query;
    console.log(`[API] GET /api/ai/staff-summary language="${language}"`);
    const response = await aiService.getStaffSummary(language);
    res.json({ response, timestamp: new Date() });
  } catch (err) {
    console.error(`[API ERROR] GET /api/ai/staff-summary failed:`, err);
    res.status(500).json({ error: 'Staff AI unavailable' });
  }
};

module.exports = { chat, navigate, getCrowdAnalysis, getTransportRec, getAccessibleRoute, getStaffSummary };
