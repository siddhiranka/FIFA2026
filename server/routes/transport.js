const express = require('express');
const router = express.Router();
const { getAll, getById, getStadiumData } = require('../controllers/transportController');

router.get('/', getAll);
router.get('/stadium', getStadiumData);
router.get('/:id', getById);

module.exports = router;
