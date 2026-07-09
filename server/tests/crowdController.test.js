const crowdController = require('../controllers/crowdController');

describe('Crowd Controller Tests', () => {
  let mockReq;
  let mockRes;
  let responseData;

  beforeEach(() => {
    mockReq = {
      params: {}
    };
    mockRes = {
      json: jest.fn().mockImplementation((data) => {
        responseData = data;
        return mockRes;
      }),
      status: jest.fn().mockImplementation(() => mockRes)
    };
    responseData = null;
  });

  test('getLiveCrowd should return fluctuated live gates data', () => {
    crowdController.getLiveCrowd(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
    expect(responseData).toBeDefined();
    expect(responseData.totalCapacity).toBe(82500);
    expect(responseData.occupancyPercent).toBeGreaterThan(0);
    expect(responseData.occupancyPercent).toBeLessThanOrEqual(100);
    expect(responseData.gates.length).toBe(6);

    // Validate that each gate has simulated density fluctuations
    responseData.gates.forEach(gate => {
      expect(gate.density).toBeGreaterThanOrEqual(0);
      expect(gate.density).toBeLessThanOrEqual(100);
      expect(gate.waitMinutes).toBeGreaterThanOrEqual(0);
    });
  });

  test('getGateCrowd should return crowd details for a valid gate', () => {
    mockReq.params.gateId = 'a';
    crowdController.getGateCrowd(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
    expect(responseData.name).toBe('Gate A');
    expect(responseData.density).toBeGreaterThanOrEqual(0);
    expect(responseData.density).toBeLessThanOrEqual(100);
  });

  test('getGateCrowd should return 404 error for invalid gate', () => {
    mockReq.params.gateId = 'Z';
    crowdController.getGateCrowd(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Gate not found' });
  });

  test('getAlerts should return alerts from crowd data', () => {
    crowdController.getAlerts(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
    expect(responseData.alerts).toBeDefined();
    expect(responseData.alerts.length).toBeGreaterThan(0);
  });
});
