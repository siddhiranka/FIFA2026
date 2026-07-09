const express = require('express');
const router = express.Router();
const { getAll, create, updateStatus } = require('../controllers/incidentController');

router.get('/', getAll);
router.post('/', create);
router.patch('/:id/status', updateStatus);

module.exports = router;
