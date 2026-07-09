const { GoogleGenerativeAI } = require('@google/generative-ai');
const stadiumData = require('../data/stadium.json');
const crowdData = require('../data/crowd.json');
const transportData = require('../data/transport.json');

let genAI;
const initializeAI = () => {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const SYSTEM_CONTEXT = `
You are StadiumPulse AI, the official AI companion for FIFA World Cup 2026 at MetLife Stadium.
You help fans and staff navigate the stadium, avoid crowds, find facilities, and travel safely.

Stadium Context:
- Stadium: MetLife Stadium, East Rutherford, NJ, USA
- Capacity: 82,500
- Gates: A (North, busy), B (East, moderate), C (South, quietest), D (West, accessible), E (Upper NE, fastest), F (Upper SW)
- Facilities: Food courts, restrooms, elevators, medical center, sensory room, prayer room, water refill stations, charging stations

Always respond in the SAME LANGUAGE as the user's message.
Keep responses concise, structured, and actionable.
Use bullet points, emojis, and clear sections.
Never output large walls of text.
`;

const callGemini = async (prompt, language = 'en', retries = 2) => {
  const ai = initializeAI();
  if (!ai) throw new Error('AI service not available');

  const model = ai.getGenerativeModel({ model: 'gemini-3.5-flash' });
  const languageName = language === 'es' ? 'Spanish' : language === 'pt' ? 'Portuguese' : 'English';
  
  const finalPrompt = `${SYSTEM_CONTEXT}
  
  CRITICAL: You MUST write your entire response ONLY in ${languageName}.
  
  User Request: ${prompt}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    let timeoutId;
    try {
      const responsePromise = model.generateContent(finalPrompt);
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Timeout')), 15000);
      });

      const result = await Promise.race([responsePromise, timeoutPromise]);
      clearTimeout(timeoutId);
      return result.response.text();
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error(`[aiService] callGemini attempt=${attempt} failed:`, err);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
};

// AI Navigation Assistant
const askNavigationAI = async (question, language = 'en') => {
  const gateInfo = stadiumData.gates.map(g =>
    `${g.name} (${g.section}, accessible: ${g.accessible}, facilities: ${g.facilities.join(', ')})`
  ).join('\n');
  const facilityInfo = stadiumData.facilities.map(f =>
    `${f.name} (${f.type}): ${f.location}`
  ).join('\n');

  const prompt = `
Stadium Navigation Query: "${question}"

Available Gates:
${gateInfo}

Available Facilities:
${facilityInfo}

Provide clear, step-by-step navigation guidance. Use emojis. Keep it under 200 words.
Include: exact gate or facility name, walking directions, any accessibility notes.
If asking about restrooms, food, or medical: give nearest option with location.
`;
  try {
    return await callGemini(prompt, language);
  } catch {
    return getFallbackNavigation(question, language);
  }
};

// Crowd Analysis
const analyzeCrowd = async (language = 'en') => {
  const gateStatus = crowdData.gates.map(g =>
    `${g.name}: ${g.density}% density, ${g.waitMinutes} min wait`
  ).join('\n');

  const prompt = `
Analyze this real-time crowd data at MetLife Stadium:
${gateStatus}
Total occupancy: ${crowdData.occupancyPercent}%

Provide:
1. 🚨 Top 2 most congested gates (warn fans)
2. ✅ Best 2 gates to use right now
3. 📊 Overall stadium status
4. 👷 Staff action recommendation
Keep it under 150 words. Use emojis and bullet points.
`;
  try {
    return await callGemini(prompt, language);
  } catch {
    return getFallbackCrowdAnalysis(language);
  }
};

// Incident Categorization
const categorizeIncident = async (incident, language = 'en') => {
  const prompt = `
Analyze this stadium incident report:
Type: ${incident.type}
Location: ${incident.location}
Priority: ${incident.priority}
Description: ${incident.description}

Return a JSON object with:
{
  "severity": "low|medium|high|critical",
  "category": "string",
  "immediateAction": "string (1 sentence)",
  "recommendation": "string (2-3 bullet points)",
  "estimatedResolutionMinutes": number
}
Only return valid JSON, no markdown.
`;
  try {
    const text = await callGemini(prompt, language);
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      severity: incident.priority,
      category: incident.type,
      immediateAction: language === 'es' ? 'Desplegar personal más cercano.' : language === 'pt' ? 'Enviar a equipe mais próxima.' : 'Dispatch nearest available staff to the location.',
      recommendation: language === 'es' ? '• Evaluar situación\n• Asegurar el área' : language === 'pt' ? '• Avaliar situação\n• Isolar a área' : '• Assess the situation\n• Secure the area\n• Escalate if needed',
      estimatedResolutionMinutes: 15
    };
  }
};

// Transport Recommendation
const getTransportRecommendation = async (origin, preference, language = 'en') => {
  const options = transportData.options.map(o =>
    `${o.type}: ETA ${o.etaMinutes}min, Cost ${o.cost}, Carbon ${o.carbonFootprint}kg CO₂, Sustainability ${o.sustainabilityScore}/10, Crowd: ${o.crowdLevel}`
  ).join('\n');

  const prompt = `
Fan needs transport to MetLife Stadium FIFA World Cup 2026.
Origin: ${origin || 'New York City'}
Preference: ${preference || 'fastest'}

Available options:
${options}

Recommend the BEST 2 options based on preference.
Include: ETA, cost, sustainability score, one tip per option.
Use emojis. Keep under 150 words.
`;
  try {
    return await callGemini(prompt, language);
  } catch {
    return getFallbackTransport(language);
  }
};

// General Chat
const generalChat = async (message, language = 'en') => {
  const prompt = `${message}

Context: You are helping fans and staff at FIFA World Cup 2026 MetLife Stadium.
Respond concisely with emojis, bullet points, and clear structure.`;
  try {
    return await callGemini(prompt, language);
  } catch (err) {
    console.error(`[aiService] generalChat failed:`, err);
    return language === 'es' ? '⚽ ¡Estoy aquí para ayudar! Pregúntame sobre accesos, transporte o servicios.' : language === 'pt' ? '⚽ Estou aqui para ajudar! Pergunte-me sobre portões, transporte ou instalações.' : '⚽ I\'m here to help! Ask me about gates, transport, facilities, accessibility, or anything about your matchday experience.';
  }
};

// Accessibility Route
const getAccessibleRoute = async (destination, needs, language = 'en') => {
  const facilities = stadiumData.facilities.filter(f => f.accessible);

  const prompt = `
Accessible navigation request at MetLife Stadium FIFA World Cup 2026.
Destination: ${destination}
Accessibility needs: ${needs || 'wheelchair user'}

Accessible facilities available: ${facilities.map(f => `${f.name} (${f.location})`).join(', ')}

Provide a clear accessible route with:
🦽 Elevator locations
♿ Accessible pathways
🚻 Nearest accessible restroom
🏥 Medical center location
Step-by-step guide. Use emojis. Under 200 words.
`;
  try {
    return await callGemini(prompt, language);
  } catch {
    return language === 'es' ? '♿ Acceda por la Puerta D (plenamente accesible). Tome el ascensor oeste. Los servicios accesibles están señalizados en azul.' : language === 'pt' ? '♿ Entre pelo Portão D (totalmente acessível). Use o elevador oeste. Banheiros acessíveis estão sinalizados em azul.' : '♿ Enter via Gate D (fully accessible). Take the West Elevator to your level. Accessible restrooms near Gate D. Medical center at Gate D, Ground Level. Follow blue accessibility signage throughout the stadium.';
  }
};

// Staff AI Summary
const getStaffSummary = async (language = 'en') => {
  const alerts = crowdData.alerts;
  const highCrowd = crowdData.gates.filter(g => g.density > 70);
  const lowCrowd = crowdData.gates.filter(g => g.density < 30);

  const prompt = `
Staff Intelligence Briefing – FIFA World Cup 2026 MetLife Stadium

Current Situation:
- Total Occupancy: ${crowdData.occupancyPercent}%
- High-density gates: ${highCrowd.map(g => g.name + ' (' + g.density + '%)').join(', ')}
- Low-density gates: ${lowCrowd.map(g => g.name + ' (' + g.density + '%)').join(', ')}
- Active alerts: ${alerts.map(a => a.message).join('; ')}

Provide:
1. 🚨 Priority actions (top 3)
2. 👷 Volunteer deployment recommendations
3. 📊 Stadium status summary
4. ⚡ Next 30-minute prediction
Keep under 200 words. Use emojis and bullet points.
`;
  try {
    return await callGemini(prompt, language);
  } catch {
    return getFallbackStaffSummary(language);
  }
};

// Fallback responses helper translations
const getFallbackNavigation = (question, lang) => {
  if (lang === 'es') {
    return `📍 **Guía de Navegación**\n\n• **Puerta A** (Norte) – Entrada general, suele estar concurrida\n• **Puerta C** (Sur) – Por lo general, la más rápida\n• **Puerta D** (Oeste) – La mejor para usuarios de sillas de ruedas\n\n🏥 Médico: Puerta D, Nivel del suelo\n🍔 Comida: Concurrencia central\n🚻 Baños: Cerca de todos los accesos`;
  }
  if (lang === 'pt') {
    return `📍 **Guia de Navegação**\n\n• **Portão A** (Norte) – Entrada geral, pode ser movimentada\n• **Portão C** (Sul) – Geralmente o mais rápido\n• **Portão D** (Oeste) – Melhor para cadeirantes\n\n🏥 Médico: Portão D, Nível Térreo\n🍔 Alimentação: Corredor Central\n🚻 Banheiros: Próximo a todos os portões`;
  }
  return `📍 **Navigation Guide**\n\n• **Gate A** (North) – General entry, can be busy\n• **Gate C** (South) – Usually the quickest\n• **Gate D** (West) – Best for wheelchair users\n• **Gate E** (Upper NE) – Fastest right now\n\n🏥 Medical: Gate D, Ground Level\n🍔 Food: Central Concourse\n🚻 Restrooms: Near all gates\n♿ Accessible: Gates A, B, D, E, F`;
};

const getFallbackCrowdAnalysis = (lang) => {
  if (lang === 'es') {
    return `📊 **Estado de Multitud**\n\n🔴 **Evitar:** Puerta A (85%), Puerta F (71%)\n🟡 **Moderado:** Puerta B (62%)\n🟢 **Mejor Entrada:** Puerta E (15%), Puerta C (28%)\n\n✅ Recomendación: ¡Use la **Puerta E** para ingresar más rápido!`;
  }
  if (lang === 'pt') {
    return `📊 **Status da Multidão**\n\n🔴 **Evitar:** Portão A (85%), Portão F (71%)\n🟡 **Moderado:** Portão B (62%)\n🟢 **Melhor Entrada:** Portão E (15%), Portão C (28%)\n\n✅ Recomendação: Use o **Portão E** para entrar mais rápido!`;
  }
  return `📊 **Live Crowd Status**\n\n🔴 **Avoid:** Gate A (85%), Gate F (71%)\n🟡 **Moderate:** Gate B (62%), Gate D (45%)\n🟢 **Best Entry:** Gate E (15%), Gate C (28%)\n\n✅ Recommendation: Use **Gate E** for fastest entry right now`;
};

const getFallbackTransport = (lang) => {
  if (lang === 'es') {
    return `🚇 **Mejores Opciones:**\n\n1. **Metro (NJ Transit)** – 25 min, $5.50, Ecológico ♻️\n2. **Autobús FIFA Shuttle** – 40 min, $8.00, Directo 🚌`;
  }
  if (lang === 'pt') {
    return `🚇 **Melhores Opções:**\n\n1. **Metrô (NJ Transit)** – 25 min, $5.50, Ecológico ♻️\n2. **Ônibus FIFA Shuttle** – 40 min, $8.00, Direto 🚌`;
  }
  return `🚇 **Best Options:**\n\n1. **Metro (NJ Transit)** – 25 min, $5.50, Eco-friendly ♻️\n2. **FIFA Shuttle** – 40 min, $8.00, Direct drop-off 🚌\n\n💡 Tip: Take the metro for fastest + greenest journey!`;
};

const getFallbackStaffSummary = (lang) => {
  if (lang === 'es') {
    return `🚨 **Acciones Prioritarias:**\n\n• Desplegar 2 voluntarios en Puerta A inmediatamente (85% densidad)\n• Redirigir aficionados de Puerta F a Puerta E por megafonía\n• Personal médico en espera en Concurrencia Este`;
  }
  if (lang === 'pt') {
    return `🚨 **Ações Prioritárias:**\n\n• Enviar 2 voluntários ao Portão A imediatamente (85% densidade)\n• Redirecionar torcedores do Portão F ao Portão E via alto-falantes\n• Equipe médica de prontidão no Corredor Leste`;
  }
  return `🚨 **Priority Actions:**\n\n• Deploy 2 volunteers to Gate A immediately (85% density)\n• Redirect fans from Gate F to Gate E via PA system\n• Medical team on standby – East Concourse surge resolved\n\n📊 Stadium at 74% capacity. Expecting peak at kickoff (T-45min)`;
};

module.exports = {
  askNavigationAI,
  analyzeCrowd,
  categorizeIncident,
  getTransportRecommendation,
  generalChat,
  getAccessibleRoute,
  getStaffSummary
};
