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

  // Additional Fallbacks in Spanish/Portuguese
  test('askNavigationAI should return Portuguese fallback on error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));
    const result = await aiService.askNavigationAI("Where is Gate C?", "pt");
    expect(result).toContain("Portão C");
    expect(result).toContain("Sul");
  });

  test('analyzeCrowd should return Spanish/Portuguese fallback on error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));
    const resEs = await aiService.analyzeCrowd("es");
    expect(resEs).toContain("Evitar");
    const resPt = await aiService.analyzeCrowd("pt");
    expect(resPt).toContain("Melhor Entrada");
  });

  test('getTransportRecommendation should return Spanish/Portuguese fallback on error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));
    const resEs = await aiService.getTransportRecommendation("Times Square", "fastest", "es");
    expect(resEs).toContain("Metro");
    const resPt = await aiService.getTransportRecommendation("Times Square", "fastest", "pt");
    expect(resPt).toContain("Ônibus");
  });

  test('getStaffSummary should return Spanish/Portuguese fallback on error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));
    const resEs = await aiService.getStaffSummary("es");
    expect(resEs).toContain("voluntarios en Puerta A");
    const resPt = await aiService.getStaffSummary("pt");
    expect(resPt).toContain("voluntários ao Portão A");
  });

  // generalChat tests
  test('generalChat should successfully query Gemini and return text', async () => {
    const mockResponseText = "MetLife Stadium is in NJ.";
    mockGenerateContent.mockResolvedValue({
      response: { text: () => mockResponseText }
    });
    const result = await aiService.generalChat("What is the stadium?", "en");
    expect(result).toBe(mockResponseText);
  });

  test('generalChat should return localized fallbacks on error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));
    const resEn = await aiService.generalChat("Hello", "en");
    expect(resEn).toContain("I'm here to help");
    
    const resEs = await aiService.generalChat("Hola", "es");
    expect(resEs).toContain("¡Estoy aquí para ayudar!");

    const resPt = await aiService.generalChat("Ola", "pt");
    expect(resPt).toContain("Estou aqui para ajudar!");
  });

  // getAccessibleRoute tests
  test('getAccessibleRoute should successfully query Gemini and return text', async () => {
    const mockResponseText = "Route is clear.";
    mockGenerateContent.mockResolvedValue({
      response: { text: () => mockResponseText }
    });
    const result = await aiService.getAccessibleRoute("Section 401", "wheelchair", "en");
    expect(result).toBe(mockResponseText);
  });

  test('getAccessibleRoute should return localized fallbacks on error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));
    const resEn = await aiService.getAccessibleRoute("Section 401", "wheelchair", "en");
    expect(resEn).toContain("Gate D");

    const resEs = await aiService.getAccessibleRoute("Section 401", "wheelchair", "es");
    expect(resEs).toContain("Puerta D");

    const resPt = await aiService.getAccessibleRoute("Section 401", "wheelchair", "pt");
    expect(resPt).toContain("Portão D");
  });

  // categorizeIncident tests
  test('categorizeIncident should successfully query Gemini and return parsed JSON', async () => {
    const mockJson = {
      severity: "high",
      category: "medical",
      immediateAction: "Send medical team.",
      recommendation: "Ensure path is clear.",
      estimatedResolutionMinutes: 10
    };
    mockGenerateContent.mockResolvedValue({
      response: { text: () => JSON.stringify(mockJson) }
    });
    const result = await aiService.categorizeIncident({
      type: "Medical",
      location: "Section 101",
      priority: "high",
      description: "Fan collapsed"
    }, "en");
    expect(result).toEqual(mockJson);
  });

  test('categorizeIncident should parse JSON wrapped in markdown ticks successfully', async () => {
    const mockJson = {
      severity: "medium",
      category: "spill",
      immediateAction: "Send janitor.",
      recommendation: "Wet floor signs.",
      estimatedResolutionMinutes: 5
    };
    const markdownResponse = `\`\`\`json\n${JSON.stringify(mockJson)}\n\`\`\``;
    mockGenerateContent.mockResolvedValue({
      response: { text: () => markdownResponse }
    });
    const result = await aiService.categorizeIncident({
      type: "Spill",
      location: "Section 102",
      priority: "medium",
      description: "Soda spilled"
    }, "en");
    expect(result).toEqual(mockJson);
  });

  test('categorizeIncident should return localized fallbacks on error', async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Overload"));
    const incidentInput = {
      type: "Fire",
      location: "Section 103",
      priority: "critical",
      description: "Smoke detected"
    };

    const resEn = await aiService.categorizeIncident(incidentInput, "en");
    expect(resEn.severity).toBe("critical");
    expect(resEn.immediateAction).toContain("Dispatch nearest available staff");

    const resEs = await aiService.categorizeIncident(incidentInput, "es");
    expect(resEs.immediateAction).toContain("Desplegar personal más cercano");

    const resPt = await aiService.categorizeIncident(incidentInput, "pt");
    expect(resPt.immediateAction).toContain("Enviar a equipe mais próxima");
  });
});
