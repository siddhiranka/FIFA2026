const crowdData = require('../data/crowd.json');

// Simulate live fluctuation
const fluctuate = (base, range = 5) => {
  const delta = (Math.random() * range * 2) - range;
  return Math.min(100, Math.max(0, Math.round(base + delta)));
};

const getLiveCrowd = (req, res) => {
  const liveData = {
    ...crowdData,
    lastUpdated: new Date(),
    currentOccupancy: crowdData.currentOccupancy + Math.floor(Math.random() * 200 - 100),
    gates: crowdData.gates.map(g => ({
      ...g,
      density: fluctuate(g.density),
      waitMinutes: Math.max(0, g.waitMinutes + Math.floor(Math.random() * 3 - 1))
    }))
  };
  liveData.occupancyPercent = Math.round((liveData.currentOccupancy / liveData.totalCapacity) * 100);
  res.json(liveData);
};

const getGateCrowd = (req, res) => {
  const { gateId } = req.params;
  const gate = crowdData.gates.find(g => g.id === gateId.toUpperCase());
  if (!gate) return res.status(404).json({ error: 'Gate not found' });
  res.json({ ...gate, density: fluctuate(gate.density), lastUpdated: new Date() });
};

const getAlerts = (req, res) => {
  res.json({ alerts: crowdData.alerts, timestamp: new Date() });
};

module.exports = { getLiveCrowd, getGateCrowd, getAlerts };
