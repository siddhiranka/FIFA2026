const aiService = require('../services/aiService');

describe('Navigation Routing Tests', () => {
  test('should return correct navigation details for Gate C in English fallback', () => {
    // Calling askNavigationAI with a mocked reject will trigger fallback
    const result = aiService.askNavigationAI('How do I reach Gate C?', 'en');
    
    // Resolving promise manually if it was caught
    return result.then(data => {
      expect(data).toContain('Gate C');
      expect(data).toContain('South');
      expect(data).toContain('🏥 Medical: Gate D');
    });
  });

  test('should return correct navigation details for Gate C in Spanish fallback', () => {
    const result = aiService.askNavigationAI('¿Cómo llego a la Puerta C?', 'es');
    
    return result.then(data => {
      expect(data).toContain('Puerta C');
      expect(data).toContain('Sur');
      expect(data).toContain('🏥 Médico: Puerta D');
    });
  });

  test('should return correct navigation details for Gate C in Portuguese fallback', () => {
    const result = aiService.askNavigationAI('Como chego ao Portão C?', 'pt');
    
    return result.then(data => {
      expect(data).toContain('Portão C');
      expect(data).toContain('Sul');
      expect(data).toContain('🏥 Médico: Portão D');
    });
  });
});
