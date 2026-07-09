const request = require('supertest');
const app = require('../index');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const aiService = require('../services/aiService');

// Mock GoogleGenerativeAI
jest.mock('@google/generative-ai');

describe('API Routes Integration Tests', () => {
  let mockGenerateContent;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateContent = jest.fn();
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: mockGenerateContent
      })
    }));
    
    // Set NODE_ENV to test to bypass DB connections & rate limits if required
    process.env.NODE_ENV = 'test';
  });

  test('POST /api/ai/navigate should return 200 with navigation route details', async () => {
    const mockResponseText = "Follow path from West Lot to Gate D (fully accessible).";
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => mockResponseText
      }
    });

    const res = await request(app)
      .post('/api/ai/navigate')
      .send({ question: "Accessible entrance?", language: "en" })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('response');
    expect(res.body.response).toBe(mockResponseText);
  });

  test('POST /api/ai/chat should return 200 with chat response', async () => {
    const mockResponseText = "Hello! Welcome to MetLife Stadium.";
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => mockResponseText
      }
    });

    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: "Hello AI", language: "en" })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('response');
    expect(res.body.response).toBe(mockResponseText);
  });

  test('GET /api/health should return 200 with ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('StadiumPulse');
  });

  test('GET /api/crowd should return live crowd data successfully', async () => {
    const res = await request(app).get('/api/crowd');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('occupancyPercent');
    expect(res.body.gates.length).toBeGreaterThan(0);
  });

  test('GET /api/transport should return transport options successfully', async () => {
    const res = await request(app).get('/api/transport');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('options');
    expect(res.body.options.length).toBeGreaterThan(0);
  });

  // Transport details & stadium info integration tests
  test('GET /api/transport/:id should return 200 for a valid transport option', async () => {
    const res = await request(app).get('/api/transport/metro');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('metro');
    expect(res.body).toHaveProperty('name');
  });

  test('GET /api/transport/:id should return 404 for an invalid transport option', async () => {
    const res = await request(app).get('/api/transport/spaceshuttle');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Transport option not found');
  });

  test('GET /api/transport/stadium should return 200 with stadium details', async () => {
    const res = await request(app).get('/api/transport/stadium');
    expect(res.status).toBe(200);
    expect(res.body.stadium.name).toBe('MetLife Stadium');
  });

  // AI controller details integration tests
  test('GET /api/ai/crowd-analysis should return 200 with AI analysis', async () => {
    const mockResponseText = "Crowd is light at south gates.";
    mockGenerateContent.mockResolvedValue({
      response: { text: () => mockResponseText }
    });
    const res = await request(app).get('/api/ai/crowd-analysis?language=en');
    expect(res.status).toBe(200);
    expect(res.body.response).toBe(mockResponseText);
  });

  test('POST /api/ai/transport should return 200 with recommendations', async () => {
    const mockResponseText = "Use Metro Transit.";
    mockGenerateContent.mockResolvedValue({
      response: { text: () => mockResponseText }
    });
    const res = await request(app)
      .post('/api/ai/transport')
      .send({ origin: "New York", preference: "fastest", language: "en" });
    expect(res.status).toBe(200);
    expect(res.body.response).toBe(mockResponseText);
  });

  test('POST /api/ai/accessible-route should return 200 with step-by-step path', async () => {
    const mockResponseText = "Go to West Gate.";
    mockGenerateContent.mockResolvedValue({
      response: { text: () => mockResponseText }
    });
    const res = await request(app)
      .post('/api/ai/accessible-route')
      .send({ destination: "Sensory Room", needs: "wheelchair", language: "en" });
    expect(res.status).toBe(200);
    expect(res.body.response).toBe(mockResponseText);
  });

  test('GET /api/ai/staff-summary should return 200 with operations summary', async () => {
    const mockResponseText = "Deploy volunteers to Gate A.";
    mockGenerateContent.mockResolvedValue({
      response: { text: () => mockResponseText }
    });
    const res = await request(app).get('/api/ai/staff-summary?language=en');
    expect(res.status).toBe(200);
    expect(res.body.response).toBe(mockResponseText);
  });

  // Input validation failures
  test('POST /api/ai/navigate should return 400 for empty question', async () => {
    const res = await request(app)
      .post('/api/ai/navigate')
      .send({ question: "", language: "en" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Question is required');
  });

  test('POST /api/ai/chat should return 400 for empty message', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: "", language: "en" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Message is required');
  });

  // Incident Operations integration tests
  test('POST /api/incidents should return 400 when missing required parameters', async () => {
    const res = await request(app)
      .post('/api/incidents')
      .send({ type: "Medical" }); // missing other params
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('All fields required');
  });

  test('POST /api/incidents, GET /api/incidents, and PATCH /api/incidents/:id/status should successfully run CRUD', async () => {
    const mockCategoryJson = {
      severity: "critical",
      category: "medical",
      immediateAction: "Deploy doctor.",
      recommendation: "Ensure wheelchair is sent.",
      estimatedResolutionMinutes: 15
    };
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify(mockCategoryJson) }
    });

    // Create incident
    const createRes = await request(app)
      .post('/api/incidents')
      .send({
        type: "Medical Emergency",
        location: "Gate D, Concourse",
        priority: "high",
        description: "Fan experiencing chest pain",
        reportedBy: "Volunteer 21"
      });
    expect(createRes.status).toBe(201);
    expect(createRes.body.type).toBe("Medical Emergency");
    expect(createRes.body.status).toBe("submitted");
    expect(createRes.body.reportedBy).toBe("Volunteer 21");
    expect(createRes.body.aiSeverity).toBe("critical");
    const incidentId = createRes.body._id;

    // Get list
    const getRes = await request(app).get('/api/incidents');
    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.length).toBeGreaterThan(0);

    // Update status
    const updateRes = await request(app)
      .patch(`/api/incidents/${incidentId}/status`)
      .send({ status: "resolved" });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe("resolved");
  });

  test('PATCH /api/incidents/:id/status should return 404 for invalid ID', async () => {
    const res = await request(app)
      .patch('/api/incidents/invalidid999/status')
      .send({ status: "investigating" });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not found');
  });

  // Fan journey end-to-end integration test
  test('Fan Journey Integration Flow', async () => {
    // 1. Health status check
    const health = await request(app).get('/api/health');
    expect(health.status).toBe(200);

    // 2. Get transport list
    const transportList = await request(app).get('/api/transport');
    expect(transportList.status).toBe(200);

    // 3. Request AI navigation path
    mockGenerateContent.mockResolvedValue({
      response: { text: () => "Take ramp A to Gate D." }
    });
    const nav = await request(app)
      .post('/api/ai/navigate')
      .send({ question: "Where is step free entry?", language: "en" });
    expect(nav.status).toBe(200);
    expect(nav.body.response).toContain("ramp A");

    // 4. View live crowd status
    const crowd = await request(app).get('/api/crowd');
    expect(crowd.status).toBe(200);
  });

  describe('Error handling & DB integration tests', () => {
    beforeAll(() => {
      // Mock mongoose connection readyState to 1 to force DB mode
      Object.defineProperty(mongoose.connection, 'readyState', {
        get: () => 1,
        configurable: true
      });
    });

    afterAll(() => {
      // Restore connection readyState
      Object.defineProperty(mongoose.connection, 'readyState', {
        get: () => 0,
        configurable: true
      });
    });

    test('GET /api/incidents should return inMemory list if Incident.find throws', async () => {
      const findSpy = jest.spyOn(Incident, 'find').mockImplementation(() => {
        return {
          sort: () => ({
            limit: () => Promise.reject(new Error('DB Query Failed'))
          })
        };
      });

      const res = await request(app).get('/api/incidents');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      findSpy.mockRestore();
    });

    test('POST /api/incidents should return 500 if Incident.create throws', async () => {
      const createSpy = jest.spyOn(Incident, 'create').mockRejectedValue(new Error('DB Save Failed'));

      const res = await request(app)
        .post('/api/incidents')
        .send({
          type: "Fire",
          location: "Gate B",
          priority: "high",
          description: "Minor trash can fire"
        });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to create incident');
      createSpy.mockRestore();
    });

    test('PATCH /api/incidents/:id/status should return 500 if Incident.findByIdAndUpdate throws', async () => {
      const updateSpy = jest.spyOn(Incident, 'findByIdAndUpdate').mockRejectedValue(new Error('DB Update Failed'));

      const res = await request(app)
        .patch('/api/incidents/someid/status')
        .send({ status: "resolved" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to update');
      updateSpy.mockRestore();
    });

    // AI Controller Error Status codes (500s)
    test('POST /api/ai/navigate should return 500 when aiService throws', async () => {
      const spy = jest.spyOn(aiService, 'askNavigationAI').mockRejectedValue(new Error('Error'));
      const res = await request(app)
        .post('/api/ai/navigate')
        .send({ question: "Gate C", language: "en" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Navigation AI unavailable');
      spy.mockRestore();
    });

    test('POST /api/ai/chat should return 500 when aiService throws', async () => {
      const spy = jest.spyOn(aiService, 'generalChat').mockRejectedValue(new Error('Error'));
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ message: "Hello", language: "en" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('AI service unavailable');
      spy.mockRestore();
    });

    test('GET /api/ai/crowd-analysis should return 500 when aiService throws', async () => {
      const spy = jest.spyOn(aiService, 'analyzeCrowd').mockRejectedValue(new Error('Error'));
      const res = await request(app).get('/api/ai/crowd-analysis?language=en');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Crowd analysis unavailable');
      spy.mockRestore();
    });

    test('POST /api/ai/transport should return 500 when aiService throws', async () => {
      const spy = jest.spyOn(aiService, 'getTransportRecommendation').mockRejectedValue(new Error('Error'));
      const res = await request(app)
        .post('/api/ai/transport')
        .send({ origin: "NY", preference: "fastest", language: "en" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Transport AI unavailable');
      spy.mockRestore();
    });

    test('POST /api/ai/accessible-route should return 500 when aiService throws', async () => {
      const spy = jest.spyOn(aiService, 'getAccessibleRoute').mockRejectedValue(new Error('Error'));
      const res = await request(app)
        .post('/api/ai/accessible-route')
        .send({ destination: "Sensory Room", needs: "wheelchair", language: "en" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Accessibility AI unavailable');
      spy.mockRestore();
    });

    test('GET /api/ai/staff-summary should return 500 when aiService throws', async () => {
      const spy = jest.spyOn(aiService, 'getStaffSummary').mockRejectedValue(new Error('Error'));
      const res = await request(app).get('/api/ai/staff-summary?language=en');
      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Staff AI unavailable');
      spy.mockRestore();
    });
  });
});
