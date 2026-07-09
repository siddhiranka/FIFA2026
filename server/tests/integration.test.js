const request = require('supertest');
const app = require('../index');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
});
