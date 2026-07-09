process.env.GEMINI_API_KEY = 'mock-key';
const aiService = require('../services/aiService');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Mock GoogleGenerativeAI
jest.mock('@google/generative-ai');

describe('AI Service Wrapper Tests', () => {
  let mockGenerateContent;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateContent = jest.fn();
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: mockGenerateContent
      })
    }));
  });

  test('askNavigationAI should successfully query Gemini and return text', async () => {
    const mockResponseText = "Go to Gate C. It is located at the South plaza.";
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => mockResponseText
      }
    });

    const result = await aiService.askNavigationAI("Where is Gate C?", "en");
    expect(result).toBe(mockResponseText);
  });

  test('askNavigationAI should return English fallback navigation guide on Gemini error', async () => {
    // Force callGemini to throw error to trigger fallback
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));

    const result = await aiService.askNavigationAI("Where is Gate C?", "en");
    expect(result).toContain("Gate C");
    expect(result).toContain("South");
  });

  test('askNavigationAI should return Spanish fallback navigation guide on Gemini error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));

    const result = await aiService.askNavigationAI("Where is Gate C?", "es");
    expect(result).toContain("Puerta C");
    expect(result).toContain("Sur");
  });

  test('analyzeCrowd should successfully query Gemini and return text', async () => {
    const mockResponseText = "Crowd levels are high at Gate A.";
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => mockResponseText
      }
    });

    const result = await aiService.analyzeCrowd("en");
    expect(result).toBe(mockResponseText);
  });

  test('analyzeCrowd should return fallback crowd analysis on error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));

    const result = await aiService.analyzeCrowd("en");
    expect(result).toContain("Gate E");
    expect(result).toContain("Avoid");
  });

  test('getTransportRecommendation should successfully query Gemini and return text', async () => {
    const mockResponseText = "Take NJ Transit rail.";
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => mockResponseText
      }
    });

    const result = await aiService.getTransportRecommendation("Times Square", "fastest", "en");
    expect(result).toBe(mockResponseText);
  });

  test('getTransportRecommendation should return fallback transport details on error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));

    const result = await aiService.getTransportRecommendation("Times Square", "fastest", "en");
    expect(result).toContain("NJ Transit");
    expect(result).toContain("FIFA Shuttle");
  });

  test('getStaffSummary should successfully query Gemini and return text', async () => {
    const mockResponseText = "All operations stable.";
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => mockResponseText
      }
    });

    const result = await aiService.getStaffSummary("en");
    expect(result).toBe(mockResponseText);
  });

  test('getStaffSummary should return fallback staff briefing on error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));

    const result = await aiService.getStaffSummary("en");
    expect(result).toContain("Deploy 2 volunteers");
    expect(result).toContain("Gate A");
  });
});
