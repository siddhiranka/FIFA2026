const express = require('express');
const router = express.Router();
const { getLiveCrowd, getGateCrowd, getAlerts } = require('../controllers/crowdController');

router.get('/', getLiveCrowd);
router.get('/gate/:gateId', getGateCrowd);
router.get('/alerts', getAlerts);

module.exports = router;
