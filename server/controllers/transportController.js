const transportData = require('../data/transport.json');

const getAll = (req, res) => {
  res.json(transportData);
};

const getById = (req, res) => {
  const { id } = req.params;
  const option = transportData.options.find(o => o.id === id);
  if (!option) return res.status(404).json({ error: 'Transport option not found' });
  res.json(option);
};

const getStadiumData = (req, res) => {
  const stadiumData = require('../data/stadium.json');
  res.json(stadiumData);
};

module.exports = { getAll, getById, getStadiumData };
