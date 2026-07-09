const express = require('express');
const router = express.Router();
const { chat, navigate, getCrowdAnalysis, getTransportRec, getAccessibleRoute, getStaffSummary } = require('../controllers/aiController');

router.post('/chat', chat);
router.post('/navigate', navigate);
router.get('/crowd-analysis', getCrowdAnalysis);
router.post('/transport', getTransportRec);
router.post('/accessible-route', getAccessibleRoute);
router.get('/staff-summary', getStaffSummary);

module.exports = router;
